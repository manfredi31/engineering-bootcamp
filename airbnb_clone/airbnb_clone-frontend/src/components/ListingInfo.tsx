import { IconType } from "react-icons";
import type { Listing } from "../hooks/useListings";
import useCountries from "../hooks/useCountries";
import type { User } from "../context/AuthContext";
import Avatar from "./Avatar";
import ListingCategory from "./ListingCategory";
import { lazy } from "react";

const Map = lazy(() => import("./Map"));

interface ListingInfoProps {
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined
    locationValue: string;
    user: User
    description: string
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    locationValue
}) => {
    const { getByValue } = useCountries();

    const coordinates = getByValue(locationValue)?.latlng;

    return (
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div
                    className="
                        text-xl
                        font-semibold
                        flex
                        flex-row
                        items-center
                        gap-2
                    "
                >
                    <div>Hosted by {user?.name}</div>
                    <Avatar src={user?.image}></Avatar>
                </div>
                <div
                    className="
                        flex
                        flex-row
                        items-center
                        gap-4
                        font-light
                        text-neutral-500
                    "
                >
                    <div>
                        {guestCount} guests
                    </div>
                    <div>
                        {roomCount} rooms
                    </div>
                    <div>
                        {bathroomCount} bathrooms
                    </div>
                </div>
            </div>
            <hr />
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                >
                </ListingCategory>
            )}
            <hr />
            <div className="text-lg font-light text-neutral-500" >
                {description}
            </div>
            <hr/>
            <Map center={coordinates} />
        </div>
    )
}

export default ListingInfo