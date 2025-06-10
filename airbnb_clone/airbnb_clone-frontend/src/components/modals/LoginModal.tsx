import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import useRegisterModal from "../../hooks/useRegisterModal"
import axios from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import toast from 'react-hot-toast'
import Button from '../Button'
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'
import { useMutation } from '@tanstack/react-query'
import useLoginModal from '../../hooks/useLoginModal'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

interface LoginResponse {
    message: string;
}

const LoginModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const { mutate, isPending } = useMutation<AxiosResponse<LoginResponse>, AxiosError<{error: string}>, FieldValues>({
        mutationFn: (data: FieldValues) => 
            axios.post('http://127.0.0.1:5000/auth/login', data, {withCredentials: true}),
        onSuccess: () => {
            toast.success('Successfully loggedin!');
            loginModal.onClose();
            queryClient.invalidateQueries({ queryKey: ["currentUser"]})
        },
        onError: (error) => {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Something went wrong during login');
            }
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        mutate(data);
    }

    const toggle = useCallback(()=>{
        loginModal.onClose();
        registerModal.onOpen();}, 
        [loginModal, registerModal]);

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title="Welcome to Airbnb" subtitle="Login to your account"/>
            <Input 
                id="email"
                label="Email"
                disabled={isPending}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="password"
                label="Password"
                type="password"
                disabled={isPending}
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
                            First time using Airbnb?
                        </div>
                        <div 
                            onClick={toggle}
                            className="text-neutral-800 cursor-pointer hover:underline">
                            Create an account
                        </div>
                    </div>


                </div>
        </div>


    )

    return (
        <Modal
            disabled={isPending}
            isOpen={loginModal.isOpen}
            onSubmit={handleSubmit(onSubmit)}
            title="Login"
            actionLabel='Continue'
            onClose={loginModal.onClose}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal