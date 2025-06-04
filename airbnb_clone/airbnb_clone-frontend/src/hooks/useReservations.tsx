import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Reservation } from "../components/ListingCard";

export const RESERVATIONS_QUERY_KEY = "reservations";

const useReservations = () => {
    return useQuery<Reservation[]>({
        queryKey: [RESERVATIONS_QUERY_KEY],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:5000/api/reservations`);
            return response.data;
        },
    });
};

export default useReservations; 