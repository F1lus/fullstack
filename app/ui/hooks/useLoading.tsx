import {useCallback, useContext} from "react";
import {LoadingContext} from "@/app/ui/context/LoadingContext";

export default function useLoading(): [
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void
] {

    const context = useContext(LoadingContext)

    if (!context) {
        throw new Error('The useLoading hook must be inside an LoadingContext Provider!')
    }

    const setIsLoading = useCallback((isLoading: boolean) => {
        context.setIsLoading(isLoading)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return [context.isLoading, setIsLoading]
}