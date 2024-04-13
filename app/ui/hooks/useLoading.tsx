import {Dispatch, SetStateAction, useContext} from "react";
import {LoadingContext} from "@/app/ui/context/LoadingContext";

export default function useLoading(): [
    errorState: boolean,
    setError: Dispatch<SetStateAction<boolean>>
] {

    const context = useContext(LoadingContext)

    if (!context) {
        throw new Error('The useLoading hook must be inside an NotificationContext Provider!')
    }

    return [context.isLoading, context.setIsLoading]
}