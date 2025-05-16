from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
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
    
    if test_config is None:
        app.config.from_object(Config)
    else:
        app.config.from_object(test_config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp)

    return app

from app import models