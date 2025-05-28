import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/auth/AuthContext';
import { format, parseISO, getDay, startOfDay } from 'date-fns';

// Placeholder for a loading spinner component
const LoadingSpinner = () => <div className="text-center p-10"><p>Loading...</p></div>;

// Placeholder for an error message component
const ErrorMessage = ({ message }) => <div className="text-center p-10 text-red-500"><p>Error: {message || 'Something went wrong.'}</p></div>;

function DoctorProfilePage() {
    const { doctorId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlotId, setSelectedSlotId] = useState(null);

    // Fetch doctor details
    const { 
        data: doctor, 
        isLoading: isLoadingDoctor, 
        error: doctorError 
    } = useQuery({
        queryKey: ['doctor', doctorId],
        queryFn: async () => {
            const { data } = await axios.get(`http://127.0.0.1:5000/api/doctors/${doctorId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return data;
        },
        enabled: !!doctorId && !!token, // Only run query if we have both doctorId and token
    });

    // Fetch available slots
    const { 
        data: slotsData, 
        isLoading: isLoadingSlots, 
        error: slotsError 
    } = useQuery({
        queryKey: ['doctorSlots', doctorId],
        queryFn: async () => {
            const { data } = await axios.get(`http://127.0.0.1:5000/api/doctors/${doctorId}/slots`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return data;
        },
        enabled: !!doctorId && !!token,
    });

    const bookAppointmentMutation = useMutation({
        mutationFn: async (slotId) => {
            const { data } = await axios.post("http://127.0.0.1:5000/api/appointments", 
                { slot_id: slotId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return data;
        },
        onSuccess: (data) => {
            alert("Appointment booked successfully!");
            setSelectedSlotId(null); // Reset selected slot
            navigate('/my-appointments'); // Navigate to appointments page
        },
        onError: (error) => {
            console.error("Booking failed:", error.response?.data);
            alert("Booking failed: " + (error.response?.data?.error || "An unexpected error occurred."));
        },
    });

    const groupedSlots = useMemo(() => {
        if (!slotsData) return {};
        
        const groups = slotsData.reduce((acc, slot) => {
            const slotDate = parseISO(slot.start_time);
            const dayKey = format(slotDate, 'yyyy-MM-dd');

            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
            acc[dayKey].push({
                id: slot.id,
                time: format(slotDate, 'hh:mm a'),
                rawStartTime: slot.start_time
            });
            return acc;
        }, {});

        for (const dayKey in groups) {
            groups[dayKey].sort((a, b) => new Date(a.rawStartTime) - new Date(b.rawStartTime));
        }
        return groups;
    }, [slotsData]);

    const availableDates = useMemo(() => {
        return Object.keys(groupedSlots).sort((a,b) => new Date(a) - new Date(b));
    }, [groupedSlots]);

    React.useEffect(() => {
        if (!selectedDate && availableDates.length > 0) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates, selectedDate]);

    if (isLoadingDoctor || isLoadingSlots) {
        return <LoadingSpinner />;
    }

    if (doctorError) {
        return <ErrorMessage message={doctorError.message} />;
    }

    if (slotsError) {
        return <ErrorMessage message={slotsError.message} />;
    }
    
    if (!doctor) {
        return <ErrorMessage message="Doctor not found." />;
    }

    const handleDateSelect = (dateKey) => {
        setSelectedDate(dateKey);
        setSelectedSlotId(null);
    };

    const handleSlotSelect = (slotId) => {
        setSelectedSlotId(slotId);
    };

    const handleBookAppointment = () => {
        if (!selectedSlotId) {
            alert("Please select a time slot first.");
            return;
        }
        bookAppointmentMutation.mutate(selectedSlotId);
    };

    return (
        <div className="py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div className="md:w-1/3">
                            <div className="bg-blue-500 rounded-lg p-1 aspect-square max-h-[350px] md:max-h-none">
                                {doctor.image_url ? (
                                    <img 
                                        src={doctor.image_url} 
                                        alt={doctor.fullname} 
                                        className="rounded-md w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 rounded-md flex items-center justify-center">
                                        <span className="text-gray-600 text-lg">No Image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:w-2/3 flex flex-col items-start space-y-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{doctor.fullname}</h1>
                            
                            <div className="flex items-center space-x-3 text-gray-600">
                                <p className="text-md">{doctor.specialty}</p>
                                {doctor.years_of_experience && (
                                    <>
                                        <span className="text-gray-400">|</span>
                                        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full"> 
                                            {doctor.years_of_experience} Years
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="pt-2">
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">About</h3>
                                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                                    {doctor.bio || 'No biography available.'}
                                </p>
                            </div>
                            
                            <div className="pt-2">
                                <p className="text-2xl font-semibold text-blue-600">
                                    Appointment fee: ${doctor.appointment_fee ? doctor.appointment_fee.toFixed(2) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-4">Booking Slots</h2>
                    
                    {availableDates.length > 0 ? (
                        <div className="mb-6 flex space-x-2 border-b pb-2 overflow-x-auto">
                            {availableDates.map(dateKey => {
                                const dateObj = parseISO(dateKey + 'T00:00:00');
                                return (
                                    <button 
                                        key={dateKey} 
                                        onClick={() => handleDateSelect(dateKey)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                            ${selectedDate === dateKey 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                            flex-shrink-0 whitespace-nowrap
                                        `}
                                    >
                                        <span className="block uppercase text-xs">{format(dateObj, 'EEE')}</span>
                                        <span className="block text-lg">{format(dateObj, 'dd')}</span>
                                        <span className="block uppercase text-xs">{format(dateObj, 'MMM')}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No available slots for this doctor.</p>
                    )}

                    {selectedDate && groupedSlots[selectedDate] && groupedSlots[selectedDate].length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {groupedSlots[selectedDate].map(slot => (
                                <button 
                                    key={slot.id} 
                                    onClick={() => handleSlotSelect(slot.id)}
                                    className={`p-3 border rounded-lg text-center transition-colors
                                        ${selectedSlotId === slot.id 
                                            ? 'bg-green-500 text-white border-green-600' 
                                            : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'}
                                    `}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    ) : selectedDate ? (
                        <p className="text-gray-500">No slots available for {format(parseISO(selectedDate + 'T00:00:00'), 'EEEE, MMM dd')}.</p>
                    ) : null}

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleBookAppointment}
                                disabled={bookAppointmentMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50"
                            >
                                {bookAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
                            </button>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfilePage; 