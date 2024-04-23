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

    const {addHandlers} = useScroll()

    const [navbarAnimation, setNavbarAnimation] = useState<{
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
            setNavbarAnimation(prevState => ({
                ...prevState,
                border: "",
                width: "100%",
                top: "0"
            }))
        } else {
            setNavbarAnimation(prevState => ({
                ...prevState,
                border: "rounded-full",
                width: "75%",
                top: "1rem"
            }))
        }
    }

    useEffect(() => {
        addHandlers(handleScroll)
    }, [addHandlers])

    return (
        <motion.div
            className={`h-[4rem] px-10 py-1 fixed left-1/2 -translate-x-[50%] bg-white ${navbarAnimation.border} shadow-lg`}
            animate={{
                width: navbarAnimation.width,
                top: navbarAnimation.top,
            }}
        >
            <div
                className="w-full h-full flex items-center justify-between"
            >
                <Link
                    className="relative w-[64px] h-full"
                    href={"/home"}
                >
                    <Image
                        src="/images/bird.png"
                        alt="application logo"
                        fill
                        sizes="(max-width: 60px), (max-height: 60px)"
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