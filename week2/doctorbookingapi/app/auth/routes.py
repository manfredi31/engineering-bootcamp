from flask import request, jsonify
from app.models import Doctor, Patient
from app import db
from app.auth import bp
from sqlalchemy import select
from flask_jwt_extended import create_access_token

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON Body"}), 400

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400
    
    if role not in ["doctor", "patient"]:
        return jsonify({"error": "Invalid role"}), 400

    Model = Doctor if role == "doctor" else Patient
    stmt = select(Model).where(Model.email == email)
    existing_user = db.session.scalar(stmt)
    if existing_user and existing_user.check_password(password):
        access_token = create_access_token(
            identity=existing_user.id,
            additional_claims={"role": role}
        )
        return jsonify(access_token=access_token), 200

@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # Basic validation

    if not data:
        return jsonify({"error": "Missing JSON Body"}), 400
    
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400
    
    if role not in ["doctor", "patient"]:
        return jsonify({"error": "Invalid role"}), 400

    # Check if email already exists
    Model = Doctor if role == "doctor" else Patient
    stmt = select(Model).where(Model.email == email)
    existing_user = db.session.scalar(stmt)
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    # Create user based on role
    if role == "doctor":
        user = Doctor(email=email)
    else:
        user = Patient(email=email)

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # Send back a JSON response to client 
    return jsonify({
        "id": user.id,
        "email": user.email,
    }), 201