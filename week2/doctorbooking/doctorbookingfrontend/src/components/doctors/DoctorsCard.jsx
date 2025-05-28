import React from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorsCard({ id, fullname, specialty, image_url }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/doctors/${id}`);
  };

  return (
    <div 
      className="bg-white border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-1px] hover:shadow-lg transition-all duration-500 w-full max-w-xs mx-auto"
      onClick={handleCardClick}
    >
      <img
        src={image_url}
        alt={fullname}
        className="w-full h-48 object-cover object-top rounded-t-xl"
      />
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center mb-2">
          <span className="h-3 w-3 bg-green-500 rounded-full inline-block mr-2"></span>
          <span className="text-green-600 text-sm font-semibold">Available</span>
        </div>
        <div className="text-base font-bold text-gray-800 mb-1">{fullname}</div>
        <div className="text-gray-500 text-sm">{specialty}</div>
      </div>
    </div>
  );
}
