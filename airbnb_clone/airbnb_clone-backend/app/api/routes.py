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
    # Get query parameters
    location_value = request.args.get('locationValue')
    guest_count = request.args.get('guestCount', type=int)
    room_count = request.args.get('roomCount', type=int)
    bathroom_count = request.args.get('bathroomCount', type=int)
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')
    category = request.args.get('category')
    
    # Start with base query
    query = Listing.query
    
    # Apply location filter
    if location_value and location_value != "undefined":
        query = query.filter(Listing.locationValue == location_value)
    
    # Apply category filter
    if category:
        query = query.filter(Listing.category == category)
    
    # Apply capacity filters (listing must have at least the requested capacity)
    if guest_count:
        query = query.filter(Listing.guestCount >= guest_count)
    
    if room_count:
        query = query.filter(Listing.roomCount >= room_count)
    
    if bathroom_count:
        query = query.filter(Listing.bathroomCount >= bathroom_count)
    
    # Apply date availability filter
    if start_date_str and end_date_str:
        try:
            # Parse ISO format dates (e.g., "2025-06-09T00:00:00+02:00")
            start_date_parsed = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            end_date_parsed = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
            
            # Convert to timezone-naive dates (strip timezone info) and extract date only
            # This ensures we compare apples to apples with database dates
            start_date = start_date_parsed.replace(tzinfo=None).date()
            end_date = end_date_parsed.replace(tzinfo=None).date()
            
            # Find listings that have NO overlapping reservations
            # A reservation overlaps if: reservation.startDate < requested_end_date AND reservation.endDate > requested_start_date
            # Using date() to ensure we compare dates only, not datetime with time components
            overlapping_reservations = db.session.query(Reservation.listingId).filter(
                db.func.date(Reservation.startDate) < end_date,
                db.func.date(Reservation.endDate) > start_date
            ).distinct()
            
            # Exclude listings that have overlapping reservations
            query = query.filter(~Listing.id.in_(overlapping_reservations))
            
        except ValueError:
            # If date parsing fails, ignore date filter
            pass
    
    listings = query.all()
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
        # Handle date-only strings (YYYY-MM-DD format) to prevent timezone issues
        # Parse as dates at midnight UTC to preserve the calendar date
        start_date = datetime.strptime(body['startDate'], '%Y-%m-%d')
        end_date = datetime.strptime(body['endDate'], '%Y-%m-%d')
    except ValueError:
        # Fallback to handle ISO format if needed
        try:
            start_date = datetime.fromisoformat(body['startDate'].replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(body['endDate'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD"}), 400
    
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


