'use client'

import Image from "next/image"
import {Button, Input} from "@nextui-org/react";
import {Query} from "@/app/lib/api/Query";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";
import {ILoginFormError} from "@/app/lib/api/error/ApiError";
import Link from "next/link";
import {useCookies} from "react-cookie";
import {AUTHORIZATION} from "@/app/lib/definitions";

const DAYS = 1
const MAX_AGE = 60 * 60 * 24 * DAYS

interface ILoginResponse extends ILoginFormError {
    token: string
}

export default function LoginPage() {

    const router = useRouter()
    const [state, setState] = useState<ILoginFormError | string>()
    const [cookies, setCookie, removeCookie] = useCookies([AUTHORIZATION])

    const handleSubmit = async (formData: FormData) => {
        const query = new Query('/auth/login')
        const response = await query.withMethod('POST')
            .withBody(formData)
            .send<ILoginResponse>()

        if (response.status === 200) {
            //setCookie(AUTHORIZATION, response.data.token, {maxAge: MAX_AGE})
            router.push('/home')
        } else {
            setState(response.data.formError ?? response.data.error)
        }
    }

    const showFormError = useCallback(() => {
        if (typeof state === "string") {
            return (
                <p className="text-red-500">{state}</p>
            )
        }
    }, [state])

    const showFieldError = useCallback(() => {
        if (typeof state !== 'string') {
            return state
        }
    }, [state])


    return (
        <div
            className="w-full h-full pb-[1rem] grid grid-rows-[_1fr] overflow-hidden md:grid-rows-[60vh_1fr] lg:grid-cols-3 lg:h-screen"
        >

            <Image
                src="/images/bird.png"
                alt="bird background"
                width={1280}
                height={720}
                priority

                className="scale-75 md:row-span-2 lg:my-auto lg:scale-100"
            />

            <div className="flex flex-col justify-center items-center gap-4 lg:col-span-2 lg:row-span-2">

                <h1 className="text-4xl font-bold">Login</h1>

                {showFormError()}

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

                        isInvalid={!!showFieldError()?.email}
                        errorMessage={showFieldError()?.email}
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

                    <Button
                        radius="full"
                        color="success"
                        variant="shadow"
                        type="submit"
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
            </div>
        </div>
    )
}