import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import useSearchModal from "../../hooks/usSearchModal";
import Modal from "./Modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CountrySelectValue } from "../inputs/CountrySelect";
import type { Range } from "react-date-range";
import CountrySelect from "../inputs/CountrySelect";
import Heading from "../Heading";
import Calendar from "../Calendar";
import Counter from "../inputs/Counter";
import { formatISO } from "date-fns";

const Map = lazy(() => import("../Map"));

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const searchModal = useSearchModal();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [step, setStep] = useState(STEPS.LOCATION);
    const [location, setLocation] = useState<CountrySelectValue>();
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if (searchParams) {
            currentQuery = Object.fromEntries(searchParams.entries());
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = new URLSearchParams(updatedQuery).toString();
        navigate(`/?${url}`);
        searchModal.onClose();
    }, [searchModal, step, location, navigate, guestCount, roomCount, bathroomCount, dateRange, searchParams, onNext]);

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return "Search";
        }
        return "Next";
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }
        return "Back";
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Where do you wanna go?"
                subtitle="Find the perfect location!"
            />
            <CountrySelect 
                value={location}
                onChange={(value) => setLocation(value)}
            />
            <hr />
            <Suspense fallback={<div>Loading map...</div>}>
                <Map center={location?.latlng} />
            </Suspense>
        </div>
    );

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="When do you plan to go?"
                    subtitle="Make sure everyone is free!"
                />
                <Calendar 
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="More information"
                    subtitle="Find your perfect place!"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests are coming?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <hr />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <hr />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms do you need?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        );
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    );
};

export default SearchModal;