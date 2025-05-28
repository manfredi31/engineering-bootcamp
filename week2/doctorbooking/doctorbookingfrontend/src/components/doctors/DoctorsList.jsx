import { useAuth } from '../../context/auth/AuthContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import DoctorsCard from './DoctorsCard';
import SpecialtyCard from './SpecialtyCard';
import { useSearchParams } from 'react-router-dom';

export default function DoctorsList () {
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const currentSpecialty = searchParams.get('specialty');

    const { 
        data: doctorsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['doctors', currentSpecialty],
        queryFn: async () => {
            let url = 'http://127.0.0.1:5000/api/doctors';
            if (currentSpecialty) {
                url = `http://127.0.0.1:5000/api/doctors/${currentSpecialty}`;
            }
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        },
        enabled: !!token,
    });

    if (isLoading) return <div className="p-4">Loading doctors...</div>;
    if (isError) return <div className="p-4 text-red-500">Error loading doctors: {error.message}</div>;

    return (
        <div className="flex w-full gap-8 p-4">
            <div className="w-64 flex-shrink-0">
                <SpecialtyCard />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 flex-1">
                {doctorsData && doctorsData.length > 0 ? (
                    doctorsData.map(doctor => (
                        <DoctorsCard 
                            key={doctor.id}
                            id={doctor.id}
                            fullname={doctor.fullname}
                            specialty={doctor.specialty}
                            image_url={doctor.image_url}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No doctors found for the selected specialty.
                    </p>
                )}
            </div>
        </div>
    );
}

