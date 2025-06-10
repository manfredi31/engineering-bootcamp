import { useNavigate, useParams } from "react-router-dom";
import useListing from "./hooks/useListing";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import useCountries from "./hooks/useCountries";
import { useMemo, useState, useEffect } from "react";
import { categories } from "./components/navbar/Categories";
import { useAuth } from "./context/AuthContext";
import type { User } from "./context/AuthContext";
import ListingHead from "./components/ListingHead";
import ListingInfo from "./components/ListingInfo";
import type { Reservation } from "./components/ListingCard";
import type { Listing } from "./hooks/useListings";
import useLoginModal from "./hooks/useLoginModal";
import { eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import useCreateReservation from "./hooks/useReservation";
import ListingReservation from "./ListingReservation";
import type { Range as CalendarRange } from "react-date-range";
import useListingReservations, { LISTING_RESERVATIONS_QUERY_KEY } from "./hooks/useListingReservations";
import { useQueryClient } from "@tanstack/react-query";

interface DateRange extends CalendarRange {
    startDate: Date;
    endDate: Date;
    key: string;
}

interface ListingPageProps {}

const ListingPage: React.FC<ListingPageProps> = () => {
    const { id } = useParams();
    const { data: currentListing, isLoading, error } = useListing(id || "");
    const { data: reservations = [], isLoading: reservationsLoading, error: reservationsError } = useListingReservations(id || "");
    const { getByValue } = useCountries();
    const queryClient = useQueryClient();

    const loginModal = useLoginModal();
    const navigate = useNavigate();
    
    // State for reservation
    const [reservationLoading, setReservationLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });
    
    // Reservation mutation
    const createReservationMutation = useCreateReservation();

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            });

            dates = [...dates, ...range]
        })

        return dates;
    }, [reservations])

    const category = useMemo(() => {
        return categories.find((item) =>
        item.label === currentListing?.category);
    }, [currentListing?.category])

    const { user } = useAuth();

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );
            
            if (dayCount && currentListing?.price) {
                setTotalPrice(dayCount * currentListing.price);
            } else {
                setTotalPrice(currentListing?.price || 0);
            }
        }
    }, [dateRange, currentListing?.price]);

    const handleCreateReservation = () => {
        if (!user) {
            loginModal.onOpen();
            return;
        }

        if (!currentListing) {
            return;
        }

        setReservationLoading(true);

        // Extract local calendar dates as YYYY-MM-DD strings to prevent timezone shifting
        const formatLocalDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        createReservationMutation.mutate({
            totalPrice,
            startDate: formatLocalDate(dateRange.startDate),
            endDate: formatLocalDate(dateRange.endDate),
            listingId: currentListing.id.toString()
        }, {
            onSuccess: () => {
                setReservationLoading(false);
                // Reset form
                setDateRange({
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                });
                setTotalPrice(0);
                
                // Invalidate and refetch reservations to update disabled dates
                queryClient.invalidateQueries({
                    queryKey: [LISTING_RESERVATIONS_QUERY_KEY, id]
                });
            },
            onError: () => {
                setReservationLoading(false);
            }
        });
    };

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

    if (reservationsError) {
        return (
            <EmptyState
                title="Error"
                subtitle="Something went wrong while fetching reservations"
            />
        );
    }

    if (!currentListing) {
        return (
            <EmptyState
                title="No listing found"
                subtitle="The listing you're looking for doesn't exist or has been removed"
            />
        );
    }

    const location = getByValue(currentListing.locationValue);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={currentListing.title}
                        imageSrc={currentListing.imageSrc}
                        locationValue={currentListing.locationValue}
                        id={currentListing.id}
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
                            user={currentListing.user}
                            category={category}
                            description={currentListing.description}
                            roomCount={currentListing.roomCount}
                            guestCount={currentListing.guestCount}
                            bathroomCount={currentListing.bathroomCount}
                            locationValue={currentListing.locationValue}
                            ></ListingInfo>
                            <div
                                className="
                                    order-first
                                    mb-10
                                    md:order-last
                                    md:col-span-3
                                "
                            >
                                <ListingReservation
                                    price={currentListing.price}
                                    totalPrice={totalPrice}
                                    onChangeDate={(value) => {
                                        if (value.startDate && value.endDate) {
                                            setDateRange({
                                                startDate: value.startDate,
                                                endDate: value.endDate,
                                                key: value.key || 'selection'
                                            });
                                        }
                                    }}
                                    dateRange={dateRange}
                                    onSubmit={handleCreateReservation}
                                    disabled={reservationLoading}
                                    disabledDates={disabledDates}
                                >
                                </ListingReservation>
                            </div>
                    </div>
                    </div>

                 
                            </div>

          
        </Container>
    ); 
}

export default ListingPage;
