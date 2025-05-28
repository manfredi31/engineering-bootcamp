from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so
from sqlalchemy import Date
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional
from datetime import datetime, timedelta, time
import calendar
import enum
from flask import request

class Specialty(enum.Enum):
    GENERAL_PHYSICIAN = "General Physician"
    GYNECOLOGIST = "Gynecologist"
    DERMATOLOGIST = "Dermatologist"
    PEDIATRICIAN = "Pediatrician"
    NEUROLOGIST = "Neurologist"
    GASTROENTEROLOGIST = "Gastroenterologist"

class Patient(db.Model):

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True, nullable=False, index=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    fullname: so.Mapped[Optional[str]] = so.mapped_column(sa.String(150))
    phone: so.Mapped[Optional[str]] = so.mapped_column(sa.String(20))
    address: so.Mapped[Optional[str]] = so.mapped_column(sa.Text)
    gender: so.Mapped[Optional[str]] = so.mapped_column(sa.String(10))
    birthday: so.Mapped[Optional[Date]] = so.mapped_column(sa.Date)
    image_path: so.Mapped[Optional[str]] = so.mapped_column(sa.String(500))
    appointments: so.Mapped[list["Appointment"]] = so.relationship(back_populates="patient", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "fullname": self.fullname,
            "phone": self.phone,
            "address": self.address,
            "gender": self.gender,
            "birthday": self.birthday.isoformat() if self.birthday else None,
            "image_url": f"{request.host_url}static/uploads/patient_images/{self.image_path}" if self.image_path else None
        }

class Doctor(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    fullname: so.Mapped[str] = so.mapped_column(unique=True, index=True, nullable=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True, nullable=False, index=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    slots: so.Mapped[list["Slot"]] = so.relationship(back_populates="doctor", cascade="all, delete-orphan")
    specialty: so.Mapped[Specialty] = so.mapped_column(sa.Enum(Specialty), nullable=True)
    image_path: so.Mapped[Optional[str]] = so.mapped_column(sa.String(500), nullable=True)
    bio: so.Mapped[Optional[str]] = so.mapped_column(sa.Text, nullable=True)
    years_of_experience: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer, nullable=True)
    appointment_fee: so.Mapped[Optional[float]] = so.mapped_column(sa.Float, nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._generate_weekly_slots()

    def _generate_weekly_slots(self):
        today = datetime.utcnow().date()
        weekday = today.weekday()  # Monday = 0
        monday = today - timedelta(days=weekday)  # find the most recent Monday

        for day_offset in range(5):  # Monday to Friday
            for hour in range(9, 17):  # 9am to 5pm (8 slots)
                start_time = datetime.combine(monday + timedelta(days=day_offset), time(hour))
                self.slots.append(Slot(start_time=start_time))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "fullname": self.fullname,
            "specialty": self.specialty.value if self.specialty else None,
            "image_url": f"{request.host_url}static/uploads/{self.image_path}" if self.image_path else None,
            "bio": self.bio,
            "years_of_experience": self.years_of_experience,
            "appointment_fee": self.appointment_fee
        }

class Slot(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    doctor_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Doctor.id), index=True, nullable=False)
    start_time: so.Mapped[datetime] = so.mapped_column(nullable=False)

    doctor: so.Mapped[Doctor] = so.relationship(back_populates="slots")
    appointment: so.Mapped["Appointment"] = so.relationship(back_populates="slot")

    def serialize(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "start_time": self.start_time.isoformat()
        }

class Appointment(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    patient_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Patient.id), index=True, nullable=False)
    slot_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Slot.id), index=True, nullable=False, unique=True)
    patient: so.Mapped[Patient] = so.relationship(back_populates="appointments")
    slot: so.Mapped[Slot] = so.relationship(back_populates="appointment")

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "slot_id": self.slot_id,
        }

