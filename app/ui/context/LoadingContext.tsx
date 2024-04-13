import {createContext, Dispatch, SetStateAction} from "react";

type LoadingState = {
    isLoading: boolean,
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export const LoadingContext = createContext<LoadingState>({
    isLoading: false,
    setIsLoading: () => {}
})