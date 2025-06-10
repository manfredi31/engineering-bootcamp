import Heading from "./Heading";
import { User } from "../context/AuthContext";
import useCountries from "../hooks/useCountries";
import { Img } from "react-image";
import HeartButton from "./HeartButton";

interface ListingHeadProps {
title: string;
locationValue: string;
imageSrc: string;
id: number;
currentUser?: User | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    locationValue,
    imageSrc,
    id,
    currentUser
}) => {
    const { getByValue } = useCountries();

    const location = getByValue(locationValue)

    return (
        <>
            <Heading
                title={title}
                subtitle={`${location?.region}, ${location?.label}`}
            ></Heading>
            <div
                className="
                    w-full
                    h-[60vh]
                    overflow-hidden
                    relative
                    rounded-xl
                "
            >
                <Img 
                    alt="image"
                    src={imageSrc}
                    className="object-cover w-full fill"
                />
                <div className="absolute top-5 right-5">
                    <HeartButton
                        listingId={id}
                        currentUser={currentUser}
                    ></HeartButton>
                </div>
                
                </div>


            

        
        </>
    )
}

export default ListingHead