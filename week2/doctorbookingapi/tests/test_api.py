from tests.base import TestBase
import json
from datetime import datetime, timedelta
from app import db

class TestDoctorBookingAPI(TestBase):
    def test_get_doctors_unauthorized(self):
        """Test that unauthorized users cannot access doctors list"""
        response = self.client.get('/api/doctors')
        self.assertEqual(response.status_code, 401)

    def test_get_doctors_as_patient(self):
        """Test getting doctors list as an authorized patient"""
        # Create a test doctor
        doctor = self.create_test_doctor()
        
        # Get doctors list with patient token
        headers = self.get_patient_token()
        response = self.client.get('/api/doctors', headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['email'], doctor.email)

    def test_get_doctor_slots(self):
        """Test getting available slots for a specific doctor"""
        # Create a test doctor (which automatically creates slots)
        doctor = self.create_test_doctor()
        
        # Get slots with patient token
        headers = self.get_patient_token()
        response = self.client.get(f'/api/doctors/{doctor.id}/slots', headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(isinstance(data, list))
        # Should have 40 slots (8 hours * 5 days)
        self.assertEqual(len(data), 40)

    def test_book_appointment(self):
        """Test booking an appointment as a patient"""
        # Create doctor and get their first available slot
        doctor = self.create_test_doctor()
        first_slot = doctor.slots[0]
        
        # Book appointment with patient token
        headers = self.get_patient_token()
        response = self.client.post('/api/appointments', 
                                  headers=headers,
                                  json={'slot_id': first_slot.id})
        
        self.assertEqual(response.status_code, 201)
        self.assertIn('Appointment booked successfully', response.json['message'])

    def test_double_booking_prevention(self):
        """Test that a slot cannot be booked twice"""
        # Create doctor and get their first available slot
        doctor = self.create_test_doctor()
        first_slot = doctor.slots[0]
        
        # Book appointment with first patient
        headers_patient1 = self.get_patient_token("patient1@test.com")
        response1 = self.client.post('/api/appointments', 
                                   headers=headers_patient1,
                                   json={'slot_id': first_slot.id})
        
        self.assertEqual(response1.status_code, 201)
        
        # Try to book same slot with second patient
        headers_patient2 = self.get_patient_token("patient2@test.com")
        response2 = self.client.post('/api/appointments', 
                                   headers=headers_patient2,
                                   json={'slot_id': first_slot.id})
        
        self.assertEqual(response2.status_code, 400)
        self.assertIn('Slot already booked', response2.json['error'])

    def test_view_my_appointments(self):
        """Test that a patient can view their appointments"""
        # Create doctor and book an appointment
        doctor = self.create_test_doctor()
        first_slot = doctor.slots[0]
        
        headers = self.get_patient_token()
        
        # Book an appointment
        self.client.post('/api/appointments', 
                        headers=headers,
                        json={'slot_id': first_slot.id})
        
        # Get my appointments
        response = self.client.get('/api/my-appointments', headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['slot_id'], first_slot.id)
        self.assertEqual(data[0]['doctor_email'], doctor.email)

    def test_slot_status(self):
        """Test checking status of a specific slot"""
        # Create doctor and book an appointment
        doctor = self.create_test_doctor()
        first_slot = doctor.slots[0]
        
        patient_headers = self.get_patient_token()
        
        # Check slot status before booking
        response1 = self.client.get(f'/api/slots/{first_slot.id}', headers=patient_headers)
        self.assertEqual(response1.status_code, 200)
        self.assertFalse(response1.json['is_booked'])
        
        # Book the slot
        self.client.post('/api/appointments', 
                        headers=patient_headers,
                        json={'slot_id': first_slot.id})
        
        # Check slot status after booking
        response2 = self.client.get(f'/api/slots/{first_slot.id}', headers=patient_headers)
        self.assertEqual(response2.status_code, 200)
        self.assertTrue(response2.json['is_booked'])
        self.assertTrue(response2.json['booked_by_you']) 