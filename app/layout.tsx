import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from "./providers"
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import {config} from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: "CopX",
        default: "CopX",
    },
    description: "The best and newest social media platform.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-[#F0F2F5]`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
