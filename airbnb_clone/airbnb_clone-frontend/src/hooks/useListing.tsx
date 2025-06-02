import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Listing } from "./useListings";

export const LISTING_QUERY_KEY = "listing";

const useListing = (listingId: string) => {
    return useQuery<Listing>({
        queryKey: [LISTING_QUERY_KEY, listingId],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:5000/api/listings/${listingId}`);
            return response.data;
        },
        enabled: !!listingId,
    });
};

export default useListing; 