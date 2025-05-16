import unittest
from app import create_app, db
from app.models import Doctor, Patient, Slot, Appointment
from datetime import datetime, timedelta
import json
import os

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SECRET_KEY = 'test-secret-key'
    JWT_SECRET_KEY = 'test-jwt-secret-key'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestBase(unittest.TestCase):
    def setUp(self):
        """Set up test app and database before each test"""
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        """Clean up after each test"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def create_test_doctor(self, email="doctor@test.com", password="test123"):
        """Helper method to create a test doctor"""
        doctor = Doctor(email=email)
        doctor.set_password(password)
        db.session.add(doctor)
        db.session.commit()
        return doctor

    def create_test_patient(self, email="patient@test.com", password="test123"):
        """Helper method to create a test patient"""
        patient = Patient(email=email)
        patient.set_password(password)
        db.session.add(patient)
        db.session.commit()
        return patient

    def get_doctor_token(self, email="doctor@test.com", password="test123"):
        """Helper method to get a doctor's JWT token"""
        doctor = Doctor.query.filter_by(email=email).first()
        if not doctor:
            doctor = self.create_test_doctor(email, password)
        return {"Authorization": f"Bearer {self.create_token(doctor.id, 'doctor')}"}

    def get_patient_token(self, email="patient@test.com", password="test123"):
        """Helper method to get a patient's JWT token"""
        patient = Patient.query.filter_by(email=email).first()
        if not patient:
            patient = self.create_test_patient(email, password)
        return {"Authorization": f"Bearer {self.create_token(patient.id, 'patient')}"}

    def create_token(self, user_id, role):
        """Helper method to create a JWT token"""
        with self.app.app_context():
            from flask_jwt_extended import create_access_token
            return create_access_token(identity=user_id, additional_claims={"role": role}) 