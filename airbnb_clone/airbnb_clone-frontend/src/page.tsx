import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/ListingCard";
import useListings from "./hooks/useListings";
import type { Listing } from "./hooks/useListings";

export default function Home() {
    const { data: listings, isLoading, error } = useListings();

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