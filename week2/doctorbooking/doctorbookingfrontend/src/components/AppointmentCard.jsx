import { Button } from "@/components/ui/button";

const BASE_IMAGE_URL = "http://127.0.0.1:5000/static/uploads/";

export default function AppointmentCard({ appointment }) {
    const { doctor_fullname, specialty, start_time, doctor_image_url } = appointment;

    // Basic date and time formatting
    const formatDateTime = (isoString) => {
        if (!isoString) return "Date not available";
        try {
            const date = new Date(isoString);
            // Example: 26 Jun 2025 | 04:30 PM
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
                   " | " + 
                   date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (e) {
            console.error("Error formatting date:", e);
            return "Invalid Date";
        }
    };

    const formattedDateTime = formatDateTime(start_time);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center space-x-4">
            <div className="flex-shrink-0">
                <img 
                    src={doctor_image_url ? `${BASE_IMAGE_URL}${doctor_image_url}` : "https://via.placeholder.com/100"}
                    alt={`Dr. ${doctor_fullname}`} 
                    className="w-24 h-24 rounded-md object-cover object-top" 
                />
            </div>
            <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800">{`Dr. ${doctor_fullname}`}</h3>
                <p className="text-md text-gray-600">{specialty}</p>
                <p className="text-sm text-gray-700 font-medium mt-1">
                    Date & Time: <span className="text-primary">{formattedDateTime}</span>
                </p>
            </div>
        </div>
    );
} 