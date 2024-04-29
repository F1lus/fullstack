'use client'

import {useParams} from "next/navigation";
import {useCallback} from "react";
import {motion} from "framer-motion";
import {ITweet} from "@/app/lib/definitions";
import Tweet from "@/app/ui/Tweet";
import useFetchTweet from "@/app/ui/hooks/useFetchTweet";

export default function TweetPage() {

    const {id} = useParams<{ id: string }>()
    const {tweet, setTweet} = useFetchTweet(id)

    const modifyTweet = useCallback((_: number, tweet: ITweet) => {
        setTweet(tweet)
    }, [setTweet])

    const renderTweet = useCallback(() => {
        if (tweet) {
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
            {renderTweet()}
        </motion.div>
    )
}