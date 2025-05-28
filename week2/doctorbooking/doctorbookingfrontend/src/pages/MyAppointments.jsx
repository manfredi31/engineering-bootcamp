import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth/AuthContext";
import AppointmentCard from "../components/AppointmentCard"; // Import the new component

export default function MyAppointments() {
    const { token } = useAuth();

    const fetchMyAppointments = async () => {
        if (!token) {
            // This case should ideally be handled by the `enabled` option in useQuery
            throw new Error("Authentication token not found.");
        }
        const response = await axios.get("http://127.0.0.1:5000/api/my-appointments", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const { data: appointments, isLoading, isError, error } = useQuery({
        queryKey: ['myAppointments'], // Simplified - no need to include token
        queryFn: fetchMyAppointments,
        enabled: !!token, // Only fetch if token is available
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <p className="text-center text-gray-500">Loading your appointments...</p>
            </div>
        );
    }

    if (isError) {
        const errorMessage = 
            error.response?.data?.message || 
            error.response?.data?.error || 
            error.message;
        return (
            <div className="container mx-auto p-4">
                <p className="text-center text-red-500">Error fetching appointments: {errorMessage}</p>
            </div>
        );
    }

    // Log fetched data for now, actual rendering will be done later
    if (appointments) {
        console.log("Fetched appointments:", appointments);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8">My appointments</h1>
            {appointments && appointments.length > 0 ? (
                <div className="space-y-6">
                    {appointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">You have no appointments.</p>
            )}
        </div>
    );
}