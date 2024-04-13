"use client"

import Image from "next/image";
import {Input} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import useScroll from "@/app/ui/hooks/useScroll";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";

export default function Navbar() {

    const scroll = useScroll()

    const [navbarAnimation, setnavbarAnimation] = useState<{
        width: "100%" | "75%",
        top: "0" | "1rem",
        border: "rounded-full" | ""
    }>({
        width: "75%",
        top: "1rem",
        border: "rounded-full"
    })

    const handleScroll = () => {
        const {scrollY} = window
        if (scrollY > 10) {
            setnavbarAnimation(prevState => ({
                ...prevState,
                border: "",
                width: "100%",
                top: "0"
            }))
        } else {
            setnavbarAnimation(prevState => ({
                ...prevState,
                border: "rounded-full",
                width: "75%",
                top: "1rem"
            }))
        }
    }

    useEffect(() => {
        scroll.addHandlers(handleScroll)
    }, [scroll])

    return (
        <motion.div
            className={`h-[4rem] px-10 fixed left-1/2 -translate-x-[50%] bg-white ${navbarAnimation.border} shadow-lg`}
            animate={{
                width: navbarAnimation.width,
                top: navbarAnimation.top,
            }}
        >
            <div
                className="w-full h-full flex items-center justify-between"
            >
                <Link
                    href={"/home"}
                >
                    <Image
                        src="/images/bird.png"
                        alt="application logo"
                        width={64}
                        height={64}
                        priority
                    />
                </Link>

                <Input
                    type="text"
                    placeholder="Search"
                    variant="bordered"
                    radius="full"
                    size="sm"

                    className="w-1/2 rounded-full"
                />

                <Link
                    href={"/profile"}
                >
                    <FontAwesomeIcon
                        icon={faUser}
                        size="xl"
                    />
                </Link>
            </div>
        </motion.div>
    )
}