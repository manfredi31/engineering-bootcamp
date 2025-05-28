from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import json
import os
load_dotenv()


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

@jwt.user_identity_loader
def user_identity_lookup(user):
    if isinstance(user, dict):
        return str(user["id"])  # Just use the ID as the subject
    return str(user)

def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app) 
    
    if test_config is None:
        app.config.from_object(Config)
    else:
        app.config.from_object(test_config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Define UPLOAD_FOLDER - adjust path as necessary
    # It's often placed under app.instance_path or a dedicated static folder
    # For simplicity, using a folder named 'uploads' in the app's static folder
    # Ensure app.static_folder is correctly configured or default
    # Get the absolute path of the directory where __init__.py is located
    base_dir = os.path.abspath(os.path.dirname(__file__))
    # Define UPLOAD_FOLDER relative to this base_dir, inside 'static'
    app.config['UPLOAD_FOLDER'] = os.path.join(base_dir, 'static', 'uploads')
    # Ensure the UPLOAD_FOLDER exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'doctor_images'))
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'patient_images'))

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp)

    # Register the new profile blueprint
    from app.api.profile import profile_bp
    app.register_blueprint(profile_bp)

    return app

from app import models