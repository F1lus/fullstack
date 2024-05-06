"use client"

import Image from "next/image";
import {Input} from "@nextui-org/react";
import Link from "next/link";
import useScroll from "@/app/ui/hooks/useScroll";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaRegUser as UserIcon} from "react-icons/fa";
import {FiLogOut as LogOutIcon} from "react-icons/fi";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {useRouter} from "next/navigation";

export default function Navbar() {

    const {addHandlers} = useScroll()
    const query$ = useQuery()
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)

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

    const handleLogout = () => {
        const params: IQueryParams = {
            method: 'DELETE',
            URL: '/logout',
        }

        query$(params).subscribe({
            next: () => {
                localStorage.removeItem('currentUserId')
                router.push('/auth/login')
            }
        })
    }

    useEffect(() => {
        const currentUserId: string | null = localStorage.getItem('currentUserId')
        setUserId(currentUserId)
    }, []);

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

                <div className="flex gap-5">
                    <Link
                        href={`/profile/${userId}`}
                    >
                        <UserIcon className="text-[1.4em]"/>
                    </Link>

                    <button onClick={handleLogout}>
                        <LogOutIcon className="text-[1.4em] text-red-500"/>
                    </button>
                </div>
            </div>
        </motion.div>
    )
}