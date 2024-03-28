'use client'

import {useEffect, useRef, useState} from "react";
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

    const getTweets = (initial = false) => {
        query$.subscribe(({ tweets }) => {
            if(!!tweets){
                if(initial) {
                    setAllTweets(tweets)
                } else {
                    setAllTweets(prevState => [ ...prevState, ...tweets ])
                    page.current++
                }
            }
        })
    }

    const handleScroll = (_: any) => {
        const bodyHeight = document.body.offsetHeight
        const viewport = window.innerHeight
        const { scrollY } = window
        if(( viewport + scrollY ) >= bodyHeight) {
            console.log('reached the end of the page, checking for new tweets...')
            getTweets()
        }
    }

    useEffect(() => {
        getTweets(true)
        subscriptionRef.current = fromEvent(document, 'scroll')
            .pipe(
                debounceTime(150),
                tap(handleScroll)
            )
            .subscribe()

        return () => {
            subscriptionRef.current?.unsubscribe()
        }
        // eslint-disable-next-line
    }, [])

    return allTweets
}