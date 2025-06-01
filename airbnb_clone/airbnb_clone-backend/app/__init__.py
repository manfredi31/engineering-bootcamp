from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import cloudinary
import cloudinary.uploader

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://manfredi:password@localhost:5434/airbnb_clone_db'  # <-- IMPORTANT: UPDATE THIS
    app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this in production!
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = True            # ✅ Only over HTTPS
    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"        # ✅ Cookie valid site-wide
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False     # (enable later if you want CSRF protection)
    app.config["JWT_COOKIE_SAMESITE"] = "Strict"      # or "Lax" depending on your needs
    app.config["JWT_ACCESS_COOKIE_NAME"] = "token"    # Optional: set custom name
    cloudinary.config(
        cloud_name="dvgdqljso",
        api_key="983739858367159",
        api_secret="CPuw3OnhkWBdnI2NfZZCSiTlWXM"
    )

    CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .api import api_bp
    app.register_blueprint(api_bp)

    from .auth import auth_bp
    app.register_blueprint(auth_bp)

    return app

from app import models