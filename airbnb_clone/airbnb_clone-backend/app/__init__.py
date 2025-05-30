from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .api import api_bp
from .auth import auth_bp

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://manfredi:password@localhost:5434/airbnb_clone_db'  # <-- IMPORTANT: UPDATE THIS
    app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this in production!
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)

    return app

from app import models