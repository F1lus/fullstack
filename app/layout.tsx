import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from "./providers"
import "./globals.css";
import {ReactNode} from "react";
import Toast from "@/app/ui/notification/Toast";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: "CopX",
        default: "CopX",
    },
    description: "The best and newest social media platform.",
};

export default function RootLayout({children}: Readonly<{ children: ReactNode; }>) {
    return (
        <html lang="en" className="bg-[#F0F2F5]">
        <body className={`${inter.className} min-h-screen`}>
        <Providers>
            {children}
            <Toast/>
        </Providers>
        </body>
        </html>
    );
}
