import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const LISTINGS_QUERY_KEY = ["listings"] as const;

export interface Listing {
    id: number;
    title: string;
    description: string;
    imageSrc: string;
    category: string;
    roomCount: number;
    bathroomCount: number;
    guestCount: number;
    locationValue: string;
    userId: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

const useListings = () => {
    return useQuery<Listing[]>({
        queryKey: LISTINGS_QUERY_KEY,
        queryFn: async () => {
            const response = await axios.get("http://127.0.0.1:5000/api/listings");
            return response.data;
        }
    });
};

export default useListings; 