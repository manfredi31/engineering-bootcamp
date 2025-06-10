import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/ListingCard";
import useListings from "./hooks/useListings";
import type { Listing } from "./hooks/useListings";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Build filters object from URL search parameters
    const filters = useMemo(() => {
        const filtersObj: any = {};
        
        const locationValue = searchParams.get('locationValue');
        const guestCount = searchParams.get('guestCount');
        const roomCount = searchParams.get('roomCount');
        const bathroomCount = searchParams.get('bathroomCount');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const category = searchParams.get('category');
        
        if (locationValue) filtersObj.locationValue = locationValue;
        if (guestCount) filtersObj.guestCount = parseInt(guestCount);
        if (roomCount) filtersObj.roomCount = parseInt(roomCount);
        if (bathroomCount) filtersObj.bathroomCount = parseInt(bathroomCount);
        if (startDate) filtersObj.startDate = startDate;
        if (endDate) filtersObj.endDate = endDate;
        if (category) filtersObj.category = category;
        
        return Object.keys(filtersObj).length > 0 ? filtersObj : undefined;
    }, [searchParams]);

    const { data: listings, isLoading, error } = useListings(filters);

    const handleReset = () => {
        setSearchParams({});
    };

    if (isLoading) {
        return (
            <EmptyState
                title="Loading..."
                subtitle="Please wait while we fetch the listings"
            />
        );
    }

    if (error) {
        return (
            <EmptyState
                title="Error"
                subtitle="Something went wrong while fetching listings"
            />
        );
    }

    if (!listings || listings.length === 0) {
        return (
            <EmptyState
                showReset
                title="No listings found"
                subtitle="Try adjusting your filters"
                onReset={handleReset}
            />
        );
    }

    return (
        <Container>
            <div className="
                pt-24
                grid
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6
                gap-8
            ">
                {listings.map((listing: Listing) => (
                    <ListingCard
                        key={listing.id}
                        data={listing}
                    ></ListingCard>
                ))}
            </div>
        </Container>
    );
}