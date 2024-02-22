import { Metadata } from "next"
import { Input, Button } from "@nextui-org/react"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Login"
}

function LoginPage() {

    return (
        <div className="w-full h-screen grid grid-rows-[40vh_1fr] overflow-hidden lg:grid-cols-3" >
            
            <Image 
                src="/images/bird.png"
                alt="bird background"
                width={1280}
                height={720}
                className="scale-75 lg:my-auto lg:scale-100 lg:row-span-2"
            />

            <div className="flex flex-col justify-center items-center gap-4 lg:col-span-2 lg:row-span-2" >
                <h1 className="text-4xl font-bold">Login</h1>
                <Input
                    type="email"
                    variant="underlined"
                    label="Email"
                    isRequired
                    className="w-3/4"
                />

                <Input
                    type="password"
                    variant="underlined"
                    label="Password"
                    isRequired
                    className="w-3/4"
                />

                <Button
                    radius="full"
                    color="success"
                    variant="shadow"
                >
                    Sign In
                </Button>
            </div>

            
        </div>
    )
}

export default LoginPage