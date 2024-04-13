'use client'

import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {ITweet} from "@/app/lib/definitions";
import useScroll from "@/app/ui/hooks/useScroll";

export default function useTweets(): [ITweet[], Dispatch<SetStateAction<ITweet[]>>] {

    const [
        allTweets,
        setAllTweets
    ] = useState<ITweet[]>([])

    const page = useRef(1)
    const query$ = useQuery()
    const scroll = useScroll()

    const getTweets = useCallback(() => {
        const params: IQueryParams = {
            URL: `/tweets?page=${page.current}`,
            method: 'GET',
            authorized: true
        }

        query$<{ tweets: ITweet[] }>(params).subscribe(({data}) => {
            const {tweets} = data
            if (tweets.length > 0) {
                setAllTweets(prevState => [...prevState, ...tweets])
                page.current++
            }
        })
    }, [query$])

    const handleScroll = useCallback(() => {
        const bodyHeight = document.body.offsetHeight
        const viewport = window.innerHeight
        const {scrollY} = window

        if ((viewport + scrollY) >= bodyHeight) {
            getTweets()
        }
    }, [getTweets])

    useEffect(() => {
        scroll.addHandlers(() => handleScroll())

        document.dispatchEvent(new Event('scroll'))
    }, [handleScroll, scroll]);

    return [allTweets, setAllTweets]
}