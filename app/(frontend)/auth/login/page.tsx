'use client'

import Image from "next/image"
import {Button, Input} from "@nextui-org/react";
import axios from "axios";

export default function LoginPage() {

    const handleSubmit = (formData: FormData) => {

        axios.post(`/api/auth/login`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    sessionStorage.setItem('token', res.data.token)
                }
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    }


    return (
        <div className="w-full h-screen grid grid-rows-[40vh_1fr] overflow-hidden lg:grid-cols-3">

            <Image
                src="/images/bird.png"
                alt="bird background"
                width={1280}
                height={720}
                priority

                className="scale-75 lg:my-auto lg:scale-100 lg:row-span-2"
            />

            <div className="flex flex-col justify-center items-center gap-4 lg:col-span-2 lg:row-span-2">
                <h1 className="text-4xl font-bold">Login</h1>

                {/*<AuthForm handleSubmit={handleSubmit}/>*/}

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
                    />

                    <Input
                        type="password"
                        name="password"
                        label="Password"
                        variant="underlined"
                        className="w-3/4"
                        isRequired
                    />

                    <Button
                        radius="full"
                        color="success"
                        variant="shadow"
                        type="submit"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    )
}