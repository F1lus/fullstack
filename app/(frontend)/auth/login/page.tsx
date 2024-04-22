'use client'

import {Button, Input} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {ILoginFormError} from "@/app/lib/api/error/ApiError";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {motion} from "framer-motion";
import useLoading from "@/app/ui/hooks/useLoading";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";

const variants = {
    hidden: {opacity: 0, x: -100, y: 0},
    enter: {opacity: 1, x: 0, y: 0},
    exit: {opacity: 0, x: 100, y: 0}
};

export default function LoginPage() {

    const router = useRouter()
    const query$ = useQuery()

    const [
        formError,
        setFormError
    ] = useState<ILoginFormError | undefined>()
    const [
        isLoading,
        setIsLoading
    ] = useLoading()

    const handleSubmit = async (formData: FormData) => {
        const params: IQueryParams = {
            URL: '/auth/login',
            authorized: false,
            body: formData,
            method: 'POST'
        }
        setIsLoading(true)

        query$<{ id: string }>(params).subscribe({
            next: ({ data: { id } }) => {
                localStorage.setItem('currentUserId', id)
                router.push('/home')
            },
            error: err => {
                setFormError(err.formError)
            }
        })
    }


    return (
        <motion.div
            key='login'
            className="flex flex-col justify-center items-center gap-4 lg:col-span-2 lg:row-span-2"
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{type: 'easeIn'}}
        >
            <FontAwesomeIcon
                className="text-[5em]"
                icon={faUser}
            />

            <h1 className="text-4xl font-bold">Login</h1>
            <p className="text-1xl">In order to continue, please sign in!</p>

            <form
                className="flex flex-col justify-center items-center gap-4 w-full"
                action={handleSubmit}
            >
                <Input
                    type="text"
                    name="email"
                    label="Email"
                    variant="underlined"
                    className="w-3/4"
                    isRequired

                    isInvalid={!!formError?.email}
                    errorMessage={formError?.email}
                />

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    variant="underlined"
                    className="w-3/4"
                    isRequired

                    isInvalid={!!formError?.password}
                    errorMessage={formError?.password}
                />

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
                    Don&apos;t have an account?&nbsp;
                    <Link
                        href={'/auth/register'}
                        className="text-blue-500"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </motion.div>
    )
}