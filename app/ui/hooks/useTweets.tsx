'use client'

import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {ITweet} from "@/app/lib/definitions";
import useScroll from "@/app/ui/hooks/useScroll";
import useNotification from "@/app/ui/hooks/useNotification";
import {NotificationType} from "@/app/ui/context/NotificationContext";

export default function useTweets(): [ITweet[], Dispatch<SetStateAction<ITweet[]>>] {

    const [
        allTweets,
        setAllTweets
    ] = useState<ITweet[]>([])

    const page = useRef(1)
    const { setNotification } = useNotification()
    const query$ = useQuery()
    const { addHandlers } = useScroll()

    const getTweets = useCallback(() => {
        const params: IQueryParams = {
            URL: `/tweets?page=${page.current}`,
            method: 'GET',
            authorized: true
        }

        query$<{ tweets: ITweet[] }>(params).subscribe({
            next: ({data}) => {
                const {tweets} = data
                if (tweets.length > 0) {
                    setAllTweets(prevState => [...prevState, ...tweets])
                    page.current++
                } else {
                    setNotification({
                        type: NotificationType.INFO,
                        message: 'You have reached the end of the tweets!'
                    })
                }
            },
            error: () => {}
        })
    }, [query$, setNotification])

    const handleScroll = useCallback(() => {
        const bodyHeight = document.body.offsetHeight
        const viewport = window.innerHeight
        const {scrollY} = window

        if ((viewport + scrollY) >= bodyHeight) {
            getTweets()
        }
    }, [getTweets])

    useEffect(() => {
        addHandlers(() => handleScroll())

        document.dispatchEvent(new Event('scroll'))

    }, [addHandlers, handleScroll]);

    return [allTweets, setAllTweets]
}