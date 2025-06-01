from . import api_bp
from flask import request, jsonify
import cloudinary.uploader
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Listing
import uuid

@api_bp.route('/')
def index():
    return 'API Blueprint'

@api_bp.route('/listing', methods=["POST"])
@jwt_required()
def create_listing():
    user_id = get_jwt_identity()
    
    body = request.get_json()
    print("Received body:", body)  # Debug print
    
    # Create new listing
    new_listing = Listing(
        id=str(uuid.uuid4()),
        title=body['title'],
        description=body['description'],
        imageSrc=body['imageSrc'],
        category=body['category'],
        roomCount=body['roomCount'],
        bathroomCount=body['bathroomCount'],
        guestCount=body['guestCount'],
        locationValue=body['location']['value'],
        price=int(body['price']),
        userId=user_id
    )

    # Add and commit to database
    db.session.add(new_listing)
    db.session.commit()

    return jsonify({"message": "Listing created successfully", "listing": {
        "id": new_listing.id,
        "title": new_listing.title,
        "description": new_listing.description,
        "imageSrc": new_listing.imageSrc,
        "category": new_listing.category,
        "roomCount": new_listing.roomCount,
        "bathroomCount": new_listing.bathroomCount,
        "guestCount": new_listing.guestCount,
        "locationValue": new_listing.locationValue,
        "price": new_listing.price,
        "userId": new_listing.userId,
        "createdAt": new_listing.createdAt.isoformat()
    }}), 201

@api_bp.route('/upload-image', methods=["POST"])
def upload_image():
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    result = cloudinary.uploader.upload(file)
    return jsonify({"url": result["secure_url"]})


