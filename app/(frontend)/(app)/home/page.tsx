"use client"

import Tweet from "@/app/ui/Tweet";
import type {ITweet} from "@/app/lib/definitions";
import useTweets from "@/app/ui/hooks/useTweets";

export default function Home() {

    const [
        allTweets,
        setAllTweets
    ] = useTweets()

    function setTweet(index: number, tweet: ITweet) {
        setAllTweets(prevState => {
            prevState[index] = tweet
            return [...prevState]
        })
    }

    return (
        <section
            className="flex flex-col items-center gap-5"
        >
            {allTweets.map((tweet: ITweet, index) => {
                return (
                    <Tweet
                        key={tweet.id}
                        tweet={tweet}
                        index={index}
                        setTweet={setTweet}
                    />
                )
            })
            }
        </section>
    )
}