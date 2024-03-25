"use client"

import {useEffect, useState} from "react";
import {Query} from "@/app/lib/api/Query";
import Tweet from "@/app/ui/Tweet";
import type {TweetProps} from "@/app/lib/definitions";

export default function Home() {

    const [tweets, setTweets] = useState([])

    useEffect(() => {
        const query = new Query('/tweets')
        query.withMethod('GET')
            .withAuthorization()
            .send()
            .then((res) => {
                    if (res.status === 200) {
                        setTweets(res.data.tweets)
                    } else {
                        console.log(res.data.error)
                    }
                }
            )
            .catch((error) => console.log(error))

    }, [])

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