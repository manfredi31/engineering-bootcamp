from flask import request, jsonify
from app.models import Doctor, Patient, Slot, Appointment as AppointmentModel, Specialty
from app import db
from app.api import bp
import sqlalchemy as sa
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from dataclasses import dataclass, asdict
from datetime import datetime

# Return list of all doctors 

@bp.route("/doctors", methods =["GET"])
@jwt_required()
def doctors():
    stmt = sa.select(Doctor)
    doctors = db.session.scalars(stmt).all()
    return jsonify([doctor.serialize() for doctor in doctors])


# Moved this route definition before the get_doctor by ID route for testing
@bp.route('/doctors/<string:specialty>', methods=['GET'])
@jwt_required()
def get_doctors_by_specialty(specialty):
    try:
        specialty_enum = Specialty(specialty)  # Convert string to enum value
        query = select(Doctor).where(Doctor.specialty == specialty_enum)
        doctors_list: list[Doctor] = db.session.scalars(query).all() # Renamed to avoid conflict
        return jsonify([doc.serialize() for doc in doctors_list]) # Renamed to avoid conflict
    except ValueError:
        return jsonify({"error": "Invalid specialty. Valid values are: " + 
                       ", ".join([s.value for s in Specialty])}), 400


# Get data for a specific doctor by ID
@bp.route("/doctors/<int:doctor_id>", methods=["GET"])
@jwt_required()
def get_doctor(doctor_id):
    stmt = sa.select(Doctor).where(Doctor.id == doctor_id)
    doctor = db.session.scalar(stmt)
    if doctor is None:
        return jsonify({"error": "Doctor not found"}), 404
    return jsonify(doctor.serialize())


# Returns available slots for specific doctor
 
@bp.route("/doctors/<int:doctor_id>/slots", methods=["GET"])
@jwt_required()
def doctors_slots(doctor_id):
    stmt = sa.select(Doctor).where(Doctor.id == doctor_id)
    doctor = db.session.scalar(stmt)
    if doctor is None:
        return jsonify({"error": "Doctor not found"}), 404
    # Only return slots that are not booked
    available_slots = [slot.serialize() for slot in doctor.slots if not slot.appointment]
    return jsonify(available_slots)


# Books an appointment if:
# 1. User is a patient (role check)
# 2. Slot exists and isn't booked

@bp.route("/appointments", methods=["POST"])
@jwt_required()
def appointments():
    data = request.get_json()
    slot_id = data.get("slot_id")
    claims = get_jwt()
    if claims["role"] != "patient":
        return jsonify({"error": "Only patients can book appointments"}), 403
    
    patient_id = get_jwt_identity()  # This will be the patient's ID
    
    stmt = select(AppointmentModel).where(AppointmentModel.slot_id == slot_id)
    if db.session.scalar(stmt) is not None:
        return jsonify({"error": "Slot already booked"}), 400

    appointment = AppointmentModel(patient_id=patient_id, slot_id=slot_id)
    db.session.add(appointment)
    db.session.commit()
    return jsonify({"message": "Appointment booked successfully"}), 201


# Shows patient's booked appointments

@dataclass
class AppointmentResponse:
    id: int
    slot_id: int
    doctor_email: str
    start_time: datetime
    doctor_image_url: str
    doctor_fullname: str
    specialty: str

@bp.route("/my-appointments", methods=["GET"])
@jwt_required()
def my_appointments():
    claims = get_jwt()
    if claims["role"] != "patient":
        return jsonify({"error": "Only patients can view their appointments"}), 403
    
    patient_id = get_jwt_identity()
    
    # Get all appointments with slot and doctor information
    stmt = (
        select(AppointmentModel)
        .join(Slot)
        .join(Doctor)
        .where(AppointmentModel.patient_id == patient_id)
    )
    appointments = db.session.scalars(stmt).all()

    appointment_dataclasses = []
    for appointment in appointments:
        appointment_dataclasses.append(AppointmentResponse(
            id=appointment.id,
            slot_id=appointment.slot.id,
            doctor_email=appointment.slot.doctor.email,
            start_time=appointment.slot.start_time,
            doctor_image_url=appointment.slot.doctor.image_path,
            doctor_fullname=appointment.slot.doctor.fullname,
            specialty=appointment.slot.doctor.specialty.value if appointment.slot.doctor.specialty else None
        ))
    
    # Convert dataclass instances to dictionaries and handle datetime serialization
    appointment_dicts = []
    for appt in appointment_dataclasses:
        appt_dict = asdict(appt)
        appt_dict['start_time'] = appt_dict['start_time'].isoformat()
        appointment_dicts.append(appt_dict)
    
    return jsonify(appointment_dicts)


# Shows status of specific slot 

@bp.route("/slots/<int:slot_id>", methods=["GET"])
@jwt_required()
def slot_status(slot_id):
    stmt = select(Slot).where(Slot.id == slot_id)
    slot = db.session.scalar(stmt)
    
    if not slot:
        return jsonify({"error": "Slot not found"}), 404
        
    return jsonify({
        "id": slot.id,
        "doctor_email": slot.doctor.email,
        "start_time": slot.start_time.isoformat(),
        "is_booked": bool(slot.appointment),
        "booked_by_you": slot.appointment.patient_id == get_jwt_identity() if slot.appointment else False
    })


@bp.route("/specialties", methods=["GET"])
@jwt_required()
def get_specialties():
    # The Specialty enum is defined in app.models
    # We can access its members and get their values
    specialties = [specialty.value for specialty in Specialty]
    return jsonify(specialties)


