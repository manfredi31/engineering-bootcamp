from . import auth_bp
from flask import request, jsonify, make_response
from app.models import User, Account, Listing, Reservation
from app import db
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
import uuid


@auth_bp.route('/me', methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    stmt = select(User).where(User.id == user_id)
    user = db.session.scalar(stmt)
    return jsonify(user.serialize())


@auth_bp.route('/login', methods=["POST"])
def login():
    data = request.get_json()

    ### Basic validation

    if not data:
        return jsonify({"error": "Missing data"}), 400
    
    email = data.get("email")
    password = data.get("password")

    ### Check if email already exists

    stmt = select(User).where(User.email == email)
    existing_user = db.session.scalar(stmt)
    if existing_user and existing_user.check_password(password):
        access_token = create_access_token(
            identity=existing_user.id)

        response = jsonify({"message": "Login succesful"})
        set_access_cookies(response, access_token)   # attaches HttpOnly cookie
        return response
    
    return jsonify({"error": "Email or password not valid"}), 400

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


@auth_bp.route('/logout', methods=["POST"])
def logout():
    response = jsonify({"message": "Logged out"})
    unset_jwt_cookies(response)
    return response