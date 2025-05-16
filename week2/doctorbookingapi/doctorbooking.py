from app import create_app, db
from app.models import Patient, Doctor, Slot, Appointment
import sqlalchemy as sa
import sqlalchemy.orm as so

app = create_app()