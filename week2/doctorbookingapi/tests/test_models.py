from tests.base import TestBase
from app.models import Doctor, Patient, Slot, Appointment
from datetime import datetime, timedelta
from app import db

class TestModels(TestBase):
    def test_patient_password_hashing(self):
        """Test patient password hashing works correctly"""
        patient = Patient(email="test@example.com")
        patient.set_password("test123")
        
        self.assertFalse(patient.check_password("wrong_password"))
        self.assertTrue(patient.check_password("test123"))
        self.assertNotEqual(patient.password_hash, "test123")

    def test_doctor_password_hashing(self):
        """Test doctor password hashing works correctly"""
        doctor = Doctor(email="doctor@example.com")
        doctor.set_password("test123")
        
        self.assertFalse(doctor.check_password("wrong_password"))
        self.assertTrue(doctor.check_password("test123"))
        self.assertNotEqual(doctor.password_hash, "test123")

    def test_doctor_slot_generation(self):
        """Test automatic slot generation for doctors"""
        doctor = Doctor(email="doctor@example.com")
        doctor.set_password("test123")
        db.session.add(doctor)
        db.session.commit()
        
        # Should have 40 slots (8 hours * 5 days)
        self.assertEqual(len(doctor.slots), 40)
        
        # Check slots are on weekdays only
        for slot in doctor.slots:
            weekday = slot.start_time.weekday()
            self.assertLess(weekday, 5)  # 0-4 are Monday-Friday
            
            # Check slots are between 9 AM and 5 PM
            hour = slot.start_time.hour
            self.assertGreaterEqual(hour, 9)
            self.assertLess(hour, 17)

    def test_appointment_creation(self):
        """Test appointment creation and relationships"""
        # Create doctor and patient
        doctor = self.create_test_doctor()
        patient = self.create_test_patient()
        slot = doctor.slots[0]
        
        # Create appointment
        appointment = Appointment(patient=patient, slot=slot)
        db.session.add(appointment)
        db.session.commit()
        
        # Test relationships
        self.assertEqual(appointment.patient, patient)
        self.assertEqual(appointment.slot, slot)
        self.assertEqual(slot.appointment, appointment)
        self.assertIn(appointment, patient.appointments)

    def test_cascade_delete(self):
        """Test that deleting a doctor cascades to slots and appointments"""
        # Create doctor, patient, and appointment
        doctor = self.create_test_doctor()
        patient = self.create_test_patient()
        slot = doctor.slots[0]
        
        appointment = Appointment(patient=patient, slot=slot)
        db.session.add(appointment)
        db.session.commit()
        
        # Store IDs for later checking
        slot_id = slot.id
        appointment_id = appointment.id
        
        # Delete doctor
        db.session.delete(doctor)
        db.session.commit()
        
        # Check that slot and appointment were deleted
        self.assertIsNone(Slot.query.get(slot_id))
        self.assertIsNone(Appointment.query.get(appointment_id))

    def test_unique_email_constraint(self):
        """Test that emails must be unique for both doctors and patients"""
        email = "test@example.com"
        
        # Create first doctor
        doctor1 = Doctor(email=email)
        db.session.add(doctor1)
        db.session.commit()
        
        # Try to create another doctor with same email
        doctor2 = Doctor(email=email)
        db.session.add(doctor2)
        with self.assertRaises(Exception):  # Should raise an integrity error
            db.session.commit()
        db.session.rollback()
        
        # Try to create a patient with same email
        patient = Patient(email=email)
        db.session.add(patient)
        with self.assertRaises(Exception):  # Should raise an integrity error
            db.session.commit()
        db.session.rollback() 