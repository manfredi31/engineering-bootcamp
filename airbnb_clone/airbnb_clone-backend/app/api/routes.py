from . import api_bp
from flask import request, jsonify
import cloudinary.uploader
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Listing, Reservation
import uuid
from datetime import datetime

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

@api_bp.route('/listings', methods=["GET"])
def get_listings():
    listings = Listing.query.all()
    return jsonify([listing.serialize() for listing in listings])

@api_bp.route('/listings/<string:listing_id>', methods=["GET"])
def get_listing(listing_id):
    listing = Listing.query.get_or_404(listing_id)
    return jsonify(listing.serialize())

@api_bp.route('/reservations', methods=["GET"])
def get_reservations():
    reservations = Reservation.query.all()
    return jsonify([reservation.serialize() for reservation in reservations])

@api_bp.route('/listings/<string:listing_id>/reservations', methods=["GET"])
def get_listing_reservations(listing_id):
    reservations = Reservation.query.filter_by(listingId=listing_id).all()
    return jsonify([reservation.serialize() for reservation in reservations])

@api_bp.route('/reservations', methods=["POST"])
@jwt_required()
def create_reservation():
    user_id = get_jwt_identity()
    
    body = request.get_json()
    print("Received reservation body:", body)  # Debug print
    
    # Validate required fields
    required_fields = ['totalPrice', 'startDate', 'endDate', 'listingId']
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Convert date strings to datetime objects
    try:
        start_date = datetime.fromisoformat(body['startDate'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(body['endDate'].replace('Z', '+00:00'))
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    
    # Validate that listing exists
    listing = Listing.query.get(body['listingId'])
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    # Create new reservation
    new_reservation = Reservation(
        id=str(uuid.uuid4()),
        startDate=start_date,
        endDate=end_date,
        totalPrice=int(body['totalPrice']),
        userId=user_id,
        listingId=body['listingId']
    )
    
    # Add and commit to database
    db.session.add(new_reservation)
    db.session.commit()
    
    return jsonify({
        "message": "Reservation created successfully",
        "reservation": {
            "id": new_reservation.id,
            "startDate": new_reservation.startDate.isoformat(),
            "endDate": new_reservation.endDate.isoformat(),
            "totalPrice": new_reservation.totalPrice,
            "createdAt": new_reservation.createdAt.isoformat(),
            "userId": new_reservation.userId,
            "listingId": new_reservation.listingId
        }
    }), 201


