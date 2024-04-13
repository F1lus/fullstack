'use client'

import {ReactNode} from "react";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";

const variants = {
    hidden: { opacity: 0, x: 100, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -100, y: 0 }
};

export default function AuthLayout({ children }: { children: ReactNode }) {

    return (
        <div
            className="w-full h-full pb-[1rem] grid grid-rows-[_1fr] overflow-hidden md:grid-rows-[60vh_1fr] lg:grid-cols-3 lg:h-screen"
        >
            <motion.div
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{ type: 'linear' }}
                className="scale-75 md:row-span-2 lg:my-auto lg:scale-100"
            >
                <Image
                    src="/images/bird.png"
                    alt="bird background"
                    width={1280}
                    height={720}
                    priority
                />
            </motion.div>
            <AnimatePresence>
                { children }
            </AnimatePresence>
        </div>
    )
}