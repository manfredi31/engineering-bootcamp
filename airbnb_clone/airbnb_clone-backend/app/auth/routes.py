from . import auth_bp
from flask import request, jsonify
from app.models import User, Account, Listing, Reservation
from app import db
from sqlalchemy import select
from flask_jwt_extended import create_access_token
import uuid

@auth_bp.route('/register', methods=["POST"])
def register():
    data = request.get_json()

    ### Basic validation

    if not data:
        return jsonify({"error": "Missing data"}), 400
    
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    ### Check if email already exists

    stmt = select(User).where(User.email == email)
    existing_user = db.session.scalar(stmt)
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400


    ### Create User

    user = User(
        id=str(uuid.uuid4()),
        email=email,
        name=name
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize())

