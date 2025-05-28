import React from "react";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../context/auth/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Import hooks for URL params and navigation

export default function SpecialtyCard() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSpecialtyFilter = searchParams.get('specialty');

  const {
    data: specialties,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:5000/api/specialties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    },
    // Only fetch if token is available to prevent errors on load if not logged in
    enabled: !!token, 
  });

  const handleSpecialtyClick = (specialty) => {
    if (currentSpecialtyFilter === specialty) {
      // If the clicked specialty is already the filter, clear it
      setSearchParams({}); // Clears all search params
      // Alternatively, to preserve other params: navigate('/doctors'); 
    } else {
      // Otherwise, set the new specialty filter
      setSearchParams({ specialty: specialty });
    }
  };

  if (isLoading) return <div className="mt-4">Loading specialties...</div>;
  if (isError) return <div className="mt-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-3 mt-4">
      <h2 className="text-lg font-semibold mb-2">Browse by specialist:</h2>
      {specialties && specialties.map((specialty) => {
        const isActive = currentSpecialtyFilter === specialty;
        return (
          <button
            key={specialty}
            onClick={() => handleSpecialtyClick(specialty)}
            className={`border rounded-md px-4 py-2 text-left transition hover:bg-gray-200 
                        ${isActive ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 bg-white'}`}
          >
            {specialty}
          </button>
        );
      })}
      {(!specialties || specialties.length === 0) && !isLoading && (
        <p>No specialties found.</p>
      )}
    </div>
  );
}
