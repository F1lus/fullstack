'use client'

import {ReactNode} from "react";
import Navbar from "@/app/ui/nav/Navbar";
import {Button} from "@nextui-org/react";
import {motion} from "framer-motion";

export default function AppLayout({children}: { children: ReactNode }) {
    return (
        <section>
            <div className="relative z-10">
                <Navbar/>
            </div>
            <div className="relative z-0 top-24">
                {children}
            </div>
            <motion.div
                className="fixed z-10 bottom-10 left-10"
                whileHover={{ scale: 1.1 }}
            >
                <Button
                    isIconOnly
                    className={`
                        rounded-full font-bold text-2xl 
                        shadow-lg p-8 bg-gradient-to-t 
                        from-sky-400 to-emerald-300
                        text-gray-600
                    `}
                >
                    +
                </Button>
            </motion.div>
        </section>
    )
}