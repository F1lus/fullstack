'use client'

import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {debounceTime, fromEvent, Subscription, tap} from "rxjs";
import useQuery from "@/app/ui/hooks/useQuery";
import {ITweet} from "@/app/lib/definitions";

export default function useTweets(): [ ITweet[], Dispatch<SetStateAction<ITweet[]>> ] {

    const [
        allTweets,
        setAllTweets
    ] = useState<ITweet[]>([])

    const page = useRef(1)
    const query$ = useQuery<{ tweets: [] }>({
        URL: `/tweets?page=${page.current}`,
        method: 'GET',
        authorized: true
    })

    const subscriptionRef = useRef<Subscription>()

    const getTweets = useCallback(() => {
        query$.subscribe(({ data }) => {
            const { tweets } = data
            if(!!tweets && tweets.length > 0){
                setAllTweets(prevState => [ ...prevState, ...tweets ])
                page.current++
                console.log(page.current)
            }
        })
    }, [query$])

    const handleScroll = useCallback(() => {
        const bodyHeight = document.body.offsetHeight
        const viewport = window.innerHeight
        const { scrollY } = window

        if(( viewport + scrollY ) >= bodyHeight) {
            console.log('reached the end of the page, checking for new tweets...')
            getTweets()
        }
    }, [getTweets])

    useEffect(() => {
        subscriptionRef.current = fromEvent(document, 'scroll').pipe(
            debounceTime(150),
            tap(() => handleScroll()),
        ).subscribe()

        document.dispatchEvent(new Event('scroll'))

        return () => {
            subscriptionRef.current?.unsubscribe()
        }
    }, [handleScroll]);

    return [ allTweets, setAllTweets ]
}