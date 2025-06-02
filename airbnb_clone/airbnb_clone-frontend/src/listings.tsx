import { useParams } from "react-router-dom";
import useListing from "./hooks/useListing";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import useCountries from "./hooks/useCountries";
import { useMemo } from "react";
import { categories } from "./components/navbar/Categories";
import { useAuth } from "./context/AuthContext";
import ListingHead from "./components/ListingHead";
import ListingInfo from "./components/ListingInfo";

export default function Listing() {
    const { id } = useParams();
    const { data: listing, isLoading, error } = useListing(id || "");
    const { getByValue } = useCountries();
    const category = useMemo(() => {
        return categories.find((item) =>
        item.label === listing?.category);
    }, [listing?.category])

    const { user } = useAuth();

    if (isLoading) {
        return (
            <EmptyState
                title="Loading..."
                subtitle="Please wait while we fetch the listing details"
            />
        );
    }

    if (error) {
        return (
            <EmptyState
                title="Error"
                subtitle="Something went wrong while fetching the listing"
            />
        );
    }

    if (!listing) {
        return (
            <EmptyState
                title="No listing found"
                subtitle="The listing you're looking for doesn't exist or has been removed"
            />
        );
    }

    const location = getByValue(listing.locationValue);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={user}
                    />
                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-7
                        md:gap-10
                        mt-6
                    ">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                            ></ListingInfo>
                    </div>
                    </div>

                 
                            </div>

          
        </Container>
    );
}
