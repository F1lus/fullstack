import {Dispatch, SetStateAction, useContext} from "react";
import {ErrorContext, ErrorState} from "@/app/ui/context/ErrorContext";

export default function useError(): [
    errorState: ErrorState | undefined,
    setError: Dispatch<SetStateAction<ErrorState | undefined>>
] {

    const context = useContext(ErrorContext)

    if(!context) {
        throw new Error('The useError hook must be inside an ErrorContext Provider!')
    }

    return [ context.errorState, context.setError ]
}