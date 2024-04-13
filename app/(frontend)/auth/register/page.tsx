'use client'

import {Button, Checkbox, Input} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";
import Link from "next/link";
import {motion} from "framer-motion";
import useLoading from "@/app/ui/hooks/useLoading";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {faAddressCard} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IRegisterFormError} from "@/app/lib/api/error/ApiError";
import useNotification from "@/app/ui/hooks/useNotification";
import {NotificationType} from "@/app/ui/context/NotificationContext";

const variants = {
    hidden: {opacity: 0, x: -100, y: 0},
    enter: {opacity: 1, x: 0, y: 0},
    exit: {opacity: 0, x: 100, y: 0}
};

export default function RegisterPage() {

    const router = useRouter()
    const query$ = useQuery()

    const { setNotification } = useNotification()

    const [
        isLoading,
        setIsLoading
    ] = useLoading()

    const [
        formError,
        setFormError
    ] = useState<IRegisterFormError | undefined>()

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        formData.set('termsAccepted', 'on')

        const params: IQueryParams = {
            URL: '/auth/register',
            authorized: false,
            method: 'POST',
            body: formData
        }


        query$(params).subscribe({
            next: () => {
                setNotification({
                    type: NotificationType.SUCCESS,
                    message: 'Your account has been created! You can now log in.'
                })
                router.push('/auth/login')
            },
            error: err => {
                setFormError(err.formError)
            }
        })
    }

    const showFieldError = useCallback(() => {
        if (formError) {
            return formError
        }
    }, [formError])

    return (
        <motion.div
            className="flex flex-col justify-center items-center gap-4 lg:col-span-2 lg:row-span-2"
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{type: 'linear'}}
        >

            <FontAwesomeIcon icon={faAddressCard} className='text-[5em]' />

            <h1
                className="text-4xl font-bold"
            >
                Register
            </h1>
            <p className="text-1xl">We would love to have you on board!</p>

            <form
                className="flex flex-col justify-center items-center gap-4 w-full"
                action={handleSubmit}
            >
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    variant="underlined"
                    className="w-3/4"
                    isRequired

                    isInvalid={!!showFieldError()?.email}
                    errorMessage={showFieldError()?.email}

                />

                <Input
                    type="text"
                    name="username"
                    label="Username"
                    variant="underlined"
                    className="w-3/4"
                    isRequired

                    isInvalid={!!showFieldError()?.username}
                    errorMessage={showFieldError()?.username}
                />

                <Input
                    type="text"
                    name="displayName"
                    label="Display Name"
                    variant="underlined"
                    className="w-3/4"
                    isRequired

                    isInvalid={!!showFieldError()?.displayName}
                    errorMessage={showFieldError()?.displayName}
                />

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    variant="underlined"
                    className="w-3/4"
                    isRequired

                    isInvalid={!!showFieldError()?.password}
                    errorMessage={showFieldError()?.password}
                />

                <Input
                    type="password"
                    name="passwordRepeat"
                    label="Password Repeat"
                    variant="underlined"
                    className="w-3/4"
                    isRequired

                    isInvalid={!!showFieldError()?.passwordRepeat}
                    errorMessage={showFieldError()?.passwordRepeat}
                />

                <Checkbox
                    name="termsAccepted"
                    className="w-3/4"
                    isRequired
                >
                    I agree to the terms and conditions
                </Checkbox>

                <Button
                    radius="full"
                    color="success"
                    variant="shadow"
                    type="submit"
                    isLoading={isLoading}
                >
                    Sign In
                </Button>

                <p>
                    Already a member?&nbsp;
                    <Link
                        href={'/auth/login'}
                        className="text-blue-500"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </motion.div>
    )
}