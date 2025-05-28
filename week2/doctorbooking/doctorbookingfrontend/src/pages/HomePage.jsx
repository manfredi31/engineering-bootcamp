import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DoctorsCard from '../components/doctors/DoctorsCard';

export default function HomePage() {
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const handleSpecialtyClick = (specialty) => {
        navigate(`/doctors?specialty=${encodeURIComponent(specialty)}`);
    };

    const { 
        data: doctorsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['topDoctors'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:5000/api/doctors', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            // Only take the first 6 doctors for the homepage
            return response.data.slice(0, 6);
        },
        enabled: !!token,
    });

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-avatars">
                            {/* Small circular avatars - placeholder */}
                            <div className="avatar-group">
                                <div className="avatar"></div>
                                <div className="avatar"></div>
                                <div className="avatar"></div>
                            </div>
                        </div>
                        <h1>Book Appointment<br />With Trusted Doctors</h1>
                        <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                        <button 
                            className="cta-button"
                            onClick={() => navigate('/doctors')}
                            >Book appointment →
                            </button>
                    </div>
                    <div className="hero-image">
                        {/* Placeholder for doctors image */}
                        <div className="doctors-placeholder">Doctors Image Placeholder</div>
                    </div>
                </div>
            </section>

            {/* Find by Speciality Section */}
            <section className="speciality-section">
                <div className="top-specialty-section"> 
                    <h2>Find by Speciality</h2>
                    <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                </div>
                <div className="speciality-grid">
                    <div className="speciality-item" onClick={() => handleSpecialtyClick('General Physician')}>
                        <div className="speciality-icon">👨‍⚕️</div>
                        <span>General physician</span>
                    </div>
                    <div className="speciality-item" onClick={() => handleSpecialtyClick('Gynecologist')}>
                        <div className="speciality-icon">👩‍⚕️</div>
                        <span>Gynecologist</span>
                    </div>
                    <div className="speciality-item" onClick={() => handleSpecialtyClick('Dermatologist')}>
                        <div className="speciality-icon">👨‍⚕️</div>
                        <span>Dermatologist</span>
                    </div>
                    <div className="speciality-item" onClick={() => handleSpecialtyClick('Pediatrician')}>
                        <div className="speciality-icon">👶</div>
                        <span>Pediatricians</span>
                    </div>
                    <div className="speciality-item" onClick={() => handleSpecialtyClick('Neurologist')}>
                        <div className="speciality-icon">🧠</div>
                        <span>Neurologist</span>
                    </div>
                    <div className="speciality-item" onClick={() => handleSpecialtyClick('Gastroenterologist')}>
                        <div className="speciality-icon">👨‍⚕️</div>
                        <span>Gastroenterologist</span>
                    </div>
                </div>
            </section>

            {/* Top Doctors Section */}
            <section className="doctors-section">
                <div className="top-doctors-section"> 
                    <h2>Top Doctors to Book</h2>
                    <p>Simply browse through our extensive list of trusted doctors.</p>
                </div>
                <div className="doctors-grid">
                    {isLoading && <div className="col-span-full text-center">Loading doctors...</div>}
                    {isError && <div className="col-span-full text-center text-red-500">Error loading doctors: {error.message}</div>}
                    {doctorsData && doctorsData.map(doctor => (
                        <DoctorsCard 
                            key={doctor.id}
                            id={doctor.id}
                            fullname={doctor.fullname}
                            specialty={doctor.specialty}
                            image_url={doctor.image_url}
                        />
                    ))}
                </div>
                <button 
                    className="more-button"
                    onClick={() => navigate('/doctors')}
                >
                    more
                </button>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2>Book Appointment<br />With 100+ Trusted Doctors</h2>
                        <button className="cta-button">Create account</button>
                    </div>
                    <div className="cta-image">
                        {/* Placeholder for doctor image */}
                        <div className="doctor-placeholder">Doctor Image Placeholder</div>
                    </div>
                </div>
            </section>
        </>
    );
}

