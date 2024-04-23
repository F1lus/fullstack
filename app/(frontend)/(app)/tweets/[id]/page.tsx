'use client'

import {useParams, useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import useNotification from "@/app/ui/hooks/useNotification";
import {NotificationType} from "@/app/ui/context/NotificationContext";
import {motion} from "framer-motion";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {ITweet} from "@/app/lib/definitions";
import Tweet from "@/app/ui/Tweet";

export default function TweetPage() {

    const { id } = useParams<{ id: string }>()
    const { setNotification } = useNotification()
    const router = useRouter();
    const query$ = useQuery();

    const [
        tweet,
        setTweet
    ] = useState<ITweet>()

    useEffect(() => {
        if(!id){
            setNotification({
                type: NotificationType.ERROR,
                message: "This content could not be found."
            })
            router.replace("/home")
            return
        }

        const params: IQueryParams = {
            URL: `/tweets/${id}`,
            method: 'GET',
            authorized: true
        }

        query$<{ tweet: ITweet }>(params).subscribe(({data}) => {
            const {tweet} = data
            setTweet(tweet)
        })

    }, [query$, router, id, setNotification]);

    const modifyTweet = useCallback((_: number, tweet: ITweet) => {
        setTweet(tweet)
    }, [])

    const renderTweet = useCallback(() => {
        if(tweet) {
            return (
                <Tweet
                    tweet={tweet}
                    index={0}
                    setTweet={modifyTweet}
                />
            )
        }
    }, [modifyTweet, tweet])

    return (
        <motion.div>
            { renderTweet() }
        </motion.div>
    )
}