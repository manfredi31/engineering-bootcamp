import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface CreateReservationData {
    totalPrice: number;
    startDate: string;
    endDate: string;
    listingId: string;
}

export interface ReservationResponse {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    createdAt: string;
    userId: string;
    listingId: string;
}

const useCreateReservation = () => {
    const queryClient = useQueryClient();

    return useMutation<ReservationResponse, Error, CreateReservationData>({
        mutationFn: async (reservationData: CreateReservationData) => {
            const response = await axios.post(
                "http://127.0.0.1:5000/api/reservations",
                reservationData,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Reservation created successfully!");
            // Invalidate reservations and listings queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["listings"] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.error || "Something went wrong";
            toast.error(errorMessage);
        },
    });
};

export default useCreateReservation; 