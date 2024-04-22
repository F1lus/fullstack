import {useCallback, useEffect, useRef} from "react";
import {debounceTime, fromEvent, Subscription, tap} from "rxjs";

export default function useScroll() {

    const scrollHandlers = useRef<Function>(() => {});
    const subscription = useRef<Subscription>();

    const addHandlers = useCallback((handler: Function) => {
        scrollHandlers.current = handler
    }, [])

    const removeHandler = useCallback(() => {
        scrollHandlers.current = () => {}
    }, [])

    useEffect(() => {
        subscription.current = fromEvent(document, 'scroll').pipe(
            debounceTime(150),
            tap(() => scrollHandlers.current())
        ).subscribe()

        return () => {
            subscription.current?.unsubscribe()
        }
    }, [scrollHandlers]);

    return {
        addHandlers,
        removeHandler,
    }
}