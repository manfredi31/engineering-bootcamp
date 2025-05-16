from flask import request, jsonify
from app.models import Doctor, Patient, Slot, Appointment
from app import db
from app.api import bp
import sqlalchemy as sa
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt

# Return list of all doctors 

@bp.route("/doctors", methods =["GET"])
@jwt_required()
def doctors():
    stmt = sa.select(Doctor)
    doctors = db.session.scalars(stmt).all()
    return jsonify([doctor.serialize() for doctor in doctors])


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
    
    stmt = select(Appointment).where(Appointment.slot_id == slot_id)
    if db.session.scalar(stmt) is not None:
        return jsonify({"error": "Slot already booked"}), 400

    appointment = Appointment(patient_id=patient_id, slot_id=slot_id)
    db.session.add(appointment)
    db.session.commit()
    return jsonify({"message": "Appointment booked successfully"}), 201


# Shows patient's booked appointments

@bp.route("/my-appointments", methods=["GET"])
@jwt_required()
def my_appointments():
    claims = get_jwt()
    if claims["role"] != "patient":
        return jsonify({"error": "Only patients can view their appointments"}), 403
    
    patient_id = get_jwt_identity()
    
    # Get all appointments with slot and doctor information
    stmt = (
        select(Appointment)
        .join(Slot)
        .join(Doctor)
        .where(Appointment.patient_id == patient_id)
    )
    appointments = db.session.scalars(stmt).all()
    
    return jsonify([{
        "id": appt.id,
        "slot_id": appt.slot_id,
        "doctor_email": appt.slot.doctor.email,
        "start_time": appt.slot.start_time.isoformat()
    } for appt in appointments])


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