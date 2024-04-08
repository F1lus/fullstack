'use client'

import { NextUIProvider } from "@nextui-org/react"
import {ErrorContext, ErrorState} from "@/app/ui/context/ErrorContext";
import {useState} from "react";

export function Providers({children} : Readonly<{children: React.ReactNode}>) {

    const [
        errorState,
        setError
    ] = useState<ErrorState | undefined>()

    return (
        <NextUIProvider>
            <ErrorContext.Provider value={{ errorState, setError }}>
                {children}
            </ErrorContext.Provider>
        </NextUIProvider>
    )
}