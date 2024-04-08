"use client"

import Tweet from "@/app/ui/Tweet";
import type {TweetProps} from "@/app/lib/definitions";
import useTweets from "@/app/ui/hooks/useTweets";

export default function Home() {

    const tweets = useTweets()

    return (
        <div className="flex flex-col items-center gap-5">
            {tweets.map((tweet: TweetProps, index) => {
                return (
                    <Tweet
                        key={index}
                        {...tweet}
                    />
                )
            })
            }
        </div>
    )
}