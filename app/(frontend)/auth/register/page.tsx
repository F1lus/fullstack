'use client'

import Image from "next/image";
import {Button, Checkbox, Input} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import {Query} from "@/app/lib/api/Query";
import {useCallback, useState} from "react";
import {IRegisterFormError} from "@/app/lib/api/error/ApiError";
import Link from "next/link";

export default function RegisterPage() {

    const router = useRouter()
    const [state, setState] = useState<IRegisterFormError | string>()

    const handleSubmit = async (formData: FormData) => {

        formData.set('termsAccepted', 'on')

        const query = new Query('/auth/register')
        const response = await query.withMethod('POST')
            .withBody(formData)
            .send<IRegisterFormError>()

        if (response.status === 200) {
            router.push('/auth/login')
        } else {
            console.log(response.data.error, response.data.formError)
            setState(response.data.formError)
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

            <div
                className="flex flex-col justify-center items-center gap-4 lg:col-span-2 lg:row-span-2"
            >
                <h1
                    className="text-4xl font-bold"
                >
                    Register
                </h1>

                {showFormError()}

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
            </div>
        </div>
    )
}