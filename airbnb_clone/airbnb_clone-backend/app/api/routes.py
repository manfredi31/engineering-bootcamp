from . import api_bp
from flask import request, jsonify
import cloudinary.uploader

@api_bp.route('/')
def index():
    return 'API Blueprint'

@api_bp.route('/upload-image', methods=["POST"])
def upload_image():
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    result = cloudinary.uploader.upload(file)
    return jsonify({"url": result["secure_url"]})