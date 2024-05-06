'use client'

import {useParams} from "next/navigation";
import {useCallback} from "react";
import {motion} from "framer-motion";
import {ITweet} from "@/app/lib/definitions";
import Tweet from "@/app/ui/tweet/Tweet";
import Comment from "@/app/ui/tweet/Comment";
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
                <div className="flex flex-col gap-5 items-center">
                    <Tweet
                        tweet={tweet}
                        index={0}
                        setTweet={modifyTweet}
                    />
                    <Comment tweet={tweet} setTweet={setTweet}/>
                </div>
            )
        }
    }, [modifyTweet, setTweet, tweet])

    return (
        <motion.div>
            {renderTweet()}
        </motion.div>
    )
}