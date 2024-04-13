import {ReactNode} from "react";
import Navbar from "@/app/ui/nav/Navbar";

export default function AppLayout({children}: { children: ReactNode }) {
    return (
        <div>
            <div className="relative z-10">
                <Navbar/>
            </div>
            <div className="relative z-0">
                {children}
            </div>
        </div>
    )
}