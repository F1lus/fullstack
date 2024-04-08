import {IFormError} from "@/app/lib/api/error/ApiError";
import {createContext, Dispatch, SetStateAction} from "react";

export type ErrorState = {
    error?: string,
    formError?: IFormError
}

type ErrorHandler = {
    errorState?: ErrorState,
    setError: Dispatch<SetStateAction<ErrorState | undefined>>
}

export const ErrorContext = createContext<ErrorHandler>({
    setError: () => {}
})