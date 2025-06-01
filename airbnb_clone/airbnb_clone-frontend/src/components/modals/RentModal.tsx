import { useCallback, useMemo, useState, lazy, Suspense } from "react";
import useRentModal from "../../hooks/useRentModal"
import Modal from "./Modal"
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { data } from "react-router-dom";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const Map = lazy(() => import("../Map"));

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const rentModal = useRentModal();
    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: "",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            iamgeSrc: "",
            price: 1,
            title: "",
            description: ""
        }
    });

    const category = watch('category');
    const location = watch('location')
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch('bathroomCount')
    const imageSrc = watch('imageSrc')


    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        })
    }

    const onBack = () => {
        setStep( (value: number) => value - 1 )
    }

    const onNext = () => {
        setStep( (value: number) => value + 1 )
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }
        return 'Next';
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }
        return 'Back';
    }, [step])

    const mutation = useMutation({
        mutationFn: (listingData: FieldValues) => {
            return axios.post('http://127.0.0.1:5000/api/listing', listingData, {withCredentials: true});
        },
        onSuccess: () => {
            toast.success('Listing Created!');
            reset();
            setStep(STEPS.CATEGORY);
            rentModal.onClose();
            setIsLoading(false);
        },
        onError: () => {
            toast.error('Something went wrong');
            setIsLoading(false);
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);
        mutation.mutate(data);
    }



    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <div 
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                    max-h-[50vh]
                    overflow-y-auto
                "
            >
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput 
                            label={item.label}
                            icon={item.icon}
                            selected={category === item.label}
                            onClick={(category) =>
                                setCustomValue('category', category)}
                        />
                    </div>
                ))} 
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Where is your place located?"
                    subtitle="Help guests find you!"
                />
                    <CountrySelect 
                        value={location}
                        onChange={(value) => setCustomValue('location', value)}
                        /> 
                    <Suspense fallback={<div>Loading map...</div>}>
                        <Map 
                            center={location?.latlng}
                        />
                    </Suspense>
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place"
                    subtitle="What ameneties do you have?"
                >
                </Heading>
                <Counter
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr/>
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr/>
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like"
                ></Heading>
                <ImageUpload 
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you describe your place?"
                    subtitle="Short and sweet works best!"
                ></Heading>
                <Input
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                ></Input>
                <hr></hr>
                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                ></Input>
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Now set your price"
                    subtitle="How much do you charge per night?"
                ></Heading>
                <Input
                    id="price"
                    label="Price"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                >
                </Input>
            </div>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            title="Airbnb your home"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            body={bodyContent}
        />
    )
}

export default RentModal