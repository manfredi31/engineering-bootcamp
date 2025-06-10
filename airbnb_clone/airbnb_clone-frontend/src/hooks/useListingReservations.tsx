import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Reservation } from "../components/ListingCard";

export const LISTING_RESERVATIONS_QUERY_KEY = "listingReservations";

const useListingReservations = (listingId: string) => {
    return useQuery<Reservation[]>({
        queryKey: [LISTING_RESERVATIONS_QUERY_KEY, listingId],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:5000/api/listings/${listingId}/reservations`);
            return response.data;
        },
        enabled: !!listingId,
    });
};

export default useListingReservations; 