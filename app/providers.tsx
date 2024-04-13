'use client'

import {NextUIProvider} from "@nextui-org/react"
import {NotificationContext, INotification} from "@/app/ui/context/NotificationContext";
import {ReactNode, useState} from "react";
import {LoadingContext} from "@/app/ui/context/LoadingContext";

export function Providers({children}: Readonly<{ children: ReactNode }>) {

    const [
        notification,
        setNotification
    ] = useState<INotification | undefined>()

    const [
        isLoading,
        setIsLoading
    ] = useState<boolean>(false)

    return (
        <NextUIProvider>
            <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
                <NotificationContext.Provider value={{notification, setNotification}}>
                    {children}
                </NotificationContext.Provider>
            </LoadingContext.Provider>
        </NextUIProvider>
    )
}