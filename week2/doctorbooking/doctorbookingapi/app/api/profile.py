from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Patient, Doctor, Specialty
from werkzeug.utils import secure_filename
import os

profile_bp = Blueprint('profile', __name__, url_prefix='/api')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Patient Profile Routes ---
@profile_bp.route('/patients/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient_profile(patient_id):
    current_user_id = get_jwt_identity()
    # Assuming the JWT identity stores the user ID directly
    # Add role check if your JWT identity includes role information
    
    patient = db.session.get(Patient, patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    # Basic check: user can only get their own profile
    # If you store role in JWT, you might allow admins or doctors to see patient profiles under certain conditions.
    if patient.id != current_user_id: # Or if role is patient and patient.id != current_user_id
        # This check assumes that the patient's user ID is what's stored in the JWT.
        # If your JWT stores an email, you'd query Patient by email and then check ID.
        # Or, more simply, your JWT should directly contain the user_id *and* their role.
        # For now, we'll assume the JWT identity *is* the patient_id for a logged-in patient.
        # This needs to be aligned with how login returns identity.
        # A more robust check would involve checking the role from the JWT.
        pass # Placeholder - will refine when login endpoint is modified to return role.


    return jsonify(patient.serialize()), 200


@profile_bp.route('/patients/<int:patient_id>/edit', methods=['POST', 'PUT']) # Using POST for simplicity, can be PUT
@jwt_required()
def edit_patient_profile(patient_id):
    current_user_id = get_jwt_identity()
    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    
    # Ensure the logged-in user is the patient they are trying to edit
    # This needs alignment with JWT identity (user_id + role)
    # if patient.id != current_user_id: # Assuming JWT identity is patient_id for a patient
    #     return jsonify({"error": "Unauthorized to edit this profile"}), 403

    data = request.form # Use request.form for multipart/form-data
    
    patient.fullname = data.get('fullname', patient.fullname)
    patient.phone = data.get('phone', patient.phone)
    patient.address = data.get('address', patient.address)
    patient.gender = data.get('gender', patient.gender)
    birthday_str = data.get('birthday')
    if birthday_str:
        try:
            patient.birthday = datetime.strptime(birthday_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid birthday format. Use YYYY-MM-DD."}), 400
            
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Ensure the upload folder for patients exists
            patient_image_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'patient_images')
            if not os.path.exists(patient_image_folder):
                os.makedirs(patient_image_folder)
            
            file_path = os.path.join(patient_image_folder, filename)
            file.save(file_path)
            patient.image_path = os.path.join('patient_images', filename) # Store relative path from UPLOAD_FOLDER

    try:
        db.session.commit()
        return jsonify({"message": "Patient profile updated successfully", "patient": patient.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@profile_bp.route('/doctors/<int:doctor_id>/edit', methods=['POST', 'PUT']) # Using POST for simplicity
@jwt_required()
def edit_doctor_profile(doctor_id):
    current_user_id = get_jwt_identity() 
    doctor = db.session.get(Doctor, doctor_id)

    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    # Ensure the logged-in user is the doctor they are trying to edit
    # This needs alignment with JWT identity (user_id + role)
    # if doctor.id != current_user_id: # Assuming JWT identity is doctor_id for a doctor
    #    return jsonify({"error": "Unauthorized to edit this profile"}), 403
        
    data = request.form # Use request.form if sending multipart/form-data (e.g. for image)
                        # or request.json if sending application/json

    doctor.fullname = data.get('fullname', doctor.fullname)
    
    specialty_str = data.get('specialty')
    if specialty_str:
        try:
            # Convert the string to the Enum member
            specialty_enum = Specialty(specialty_str)
            doctor.specialty = specialty_enum
        except ValueError:
            # Handle the case where the provided specialty string is not a valid enum member
            return jsonify({"error": f"Invalid specialty value: {specialty_str}. Valid values are: {[s.value for s in Specialty]}"}), 400
    
    doctor.bio = data.get('bio', doctor.bio)

    yoe_str = data.get('years_of_experience')
    if yoe_str == '':
        doctor.years_of_experience = None
    else:
        try:
            doctor.years_of_experience = int(yoe_str)
        except ValueError:
            return jsonify({"error": f"Invalid years_of_experience value: {yoe_str}. Must be a whole number."}), 400

    fee_str = data.get('appointment_fee')
    if fee_str == '':
        doctor.appointment_fee = None
    else:
        try:
            doctor.appointment_fee = float(fee_str)
        except ValueError:
            return jsonify({"error": f"Invalid appointment_fee value: {fee_str}. Must be a number."}), 400

    # Handle doctor image upload if it's different from patient or already exists
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            doctor_image_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'doctor_images')
            if not os.path.exists(doctor_image_folder):
                os.makedirs(doctor_image_folder)
            
            file_path = os.path.join(doctor_image_folder, filename)
            file.save(file_path)
            doctor.image_path = os.path.join('doctor_images', filename)


    try:
        db.session.commit()
        return jsonify({"message": "Doctor profile updated successfully", "doctor": doctor.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating doctor profile: {e}")
        return jsonify({"error": "Failed to update doctor profile"}), 500 