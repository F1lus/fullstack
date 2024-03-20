'use client'

import {useCallback, useEffect, useRef, useState} from "react";
import {debounceTime, fromEvent, Subscription, tap} from "rxjs";
import useQuery from "@/app/ui/hooks/useQuery";

export default function useTweets() {

    const [
        allTweets,
        setAllTweets
    ] = useState<[]>([])

    const page = useRef(1)
    const query$ = useQuery<{ tweets: [] }>({
        URL: `/tweets?page=${page.current}`,
        method: 'GET',
        authorized: true
    })

    const subscriptionRef = useRef<Subscription>()

    const handleScroll = useCallback((_: any) => {
        const bodyHeight = document.body.offsetHeight
        const viewport = window.innerHeight
        const { scrollY } = window
        if(( viewport + scrollY ) >= bodyHeight) {
            query$.subscribe(({ tweets }) => {
                if(!!tweets){
                    setAllTweets(prevState => [ ...prevState, ...tweets ])
                    page.current++
                }
            })
        }
    }, [query$])

    useEffect(() => {
        subscriptionRef.current = fromEvent(document, 'scroll')
            .pipe(
                debounceTime(150),
                tap(handleScroll)
            )
            .subscribe()

        return () => {
            subscriptionRef.current?.unsubscribe()
        }
    }, [handleScroll])

    return allTweets
}