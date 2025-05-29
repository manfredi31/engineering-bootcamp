import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import useRegisterModal from "../../hooks/useRegisterModal"
import axios from 'axios'
import { useState } from 'react'
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import toast from 'react-hot-toast'
import Button from '../Button'
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('api/register', data)
            .then(() => {
                registerModal.onClose();
            })
            .catch(() => {
                toast.error("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title="Welcome to Airbnb" subtitle="Create an account"/>
            <Input 
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'> 
            <hr />
            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() =>{}}
            />
            <Button
                outline
                label="Continue with GitHub"
                icon={AiFillGithub}
                onClick={() =>{}}
            />
            <div
                onClick={() =>{}}
                className='
                    text-neutral-500
                    text-center
                    mt-4
                    font-light
                '
                >   <div className="flex flex-row items-center justify-center gap-2"> 
                        <div>
                            Already have an account?
                        </div>
                        <div className="text-neutral-800 cursor-pointer hover:underline">
                            Log in
                        </div>
                    </div>


                </div>
        </div>


    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            onSubmit={handleSubmit(onSubmit)}
            title="Register"
            actionLabel='Register'
            onClose={registerModal.onClose}
            body={bodyContent}
            footer={footerContent}

        />
    )
}

export default RegisterModal