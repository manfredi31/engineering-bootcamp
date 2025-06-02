import { useNavigate } from "react-router-dom";
import useCountries from '../hooks/useCountries'
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext"
import HeartButton from "./HeartButton";
import Button from "./Button";
import { User } from "../context/AuthContext";

// These interfaces should match the Flask backend's data structure
interface Listing {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  price: number;
  userId: string;
  user: User
}

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  userId: string;
  listingId: string;
}

interface ListingCardProps {
  data: Listing;
  reservation?: Reservation;
  onAction?: (id: number) => void; 
  disabled?: boolean;
  actionLabel?: string;
  actionId?: number; 
  currentUser?: User | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId,
  currentUser
}) => {
  const navigate = useNavigate();
  const { getByValue } = useCountries();
  const { user } = useAuth();

  const location = getByValue(data.locationValue);  

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      
      if (disabled) {
        return;
      }

      if (actionId) {
        onAction?.(actionId);
      }
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice; 
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);  
    const end = new Date(reservation.endDate);     

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  return (
    <div
      onClick={() => navigate(`/listings/${data.id}`)}
      className="
        col-span-1 
        cursor-pointer 
        group
      "
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square
            w-full
            relative
            overflow-hidden
            rounded-xl
          "
        >
          <img
            alt="Listing"
            src={data.imageSrc}  
            className="
              object-cover
              h-full
              w-full
              group-hover:scale-110
              transition
            "
          />
          <div className="absolute top-3 right-4">
            <HeartButton
                listingId={data.id}
                currentUser={user}
            ></HeartButton>
          </div>
        </div>
        <div className="font-semibold text-lg">
        {location?.region}, {location?.label}
      </div>
      <div className="font-light text-neutral-500">
        {reservationDate || data.category}
      </div>
      <div className="flex flex-row items-center gap-1">
        <div className="font-semibold">$ {price} </div>
        {!reservation && (
          <div className="font-light">night</div>
        )}
        <div>
          {onAction && actionLabel && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
              ></Button>
          )}
        </div>
      </div>
    

      </div>
    </div>
  );
}

export default ListingCard;
