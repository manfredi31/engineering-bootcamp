import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "../context/AuthContext";

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
    userId: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    user: User
}

interface ListingFilters {
    locationValue?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
}

const useListings = (filters?: ListingFilters) => {
    return useQuery<Listing[]>({
        queryKey: [...LISTINGS_QUERY_KEY, filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });
            }
            
            const url = `http://127.0.0.1:5000/api/listings${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await axios.get(url);
            return response.data;
        }
    });
};

export default useListings; 