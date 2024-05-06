"use client"

import {Avatar} from "@nextui-org/avatar";
import {useCallback, useEffect, useState} from "react";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {ITweet} from "@/app/lib/definitions";
import Tweet from "@/app/ui/Tweet";
import {switchMap} from "rxjs";
import {useParams} from "next/navigation";

type ProfileData = {
    profilePicture: string
    name: string
    displayName: string
    id: string
    description: string
    createdAt: Date
}

export default function ProfilePage() {

    const query$ = useQuery()

    const [profileData, setProfileData] = useState<ProfileData>()
    const [tweets, setTweets] = useState<ITweet[]>([])

    const userId = useParams().id

    useEffect(() => {
        const profileParams: IQueryParams = {
            URL: `/profile/${userId}`,
            method: 'GET',
            authorized: true
        }

        const tweetsParams: IQueryParams = {
            URL: `/tweets?userId=${userId}`,
            method: 'GET',
            authorized: true
        }

        query$(profileParams).pipe(
            switchMap(({data: {profile}}) => {
                    setProfileData(profile)
                    return query$(tweetsParams)
                }
            )
        ).subscribe(({data: {tweets}}) => {
            setTweets(tweets)
        })

    }, [query$])

    const setTweet = (index: number, tweet: ITweet) => {
        setTweets(prevState => {
            prevState[index] = tweet
            return [...prevState]
        })
    }

    const renderTweets = useCallback(() => {
        if (tweets.length > 0) {
            return tweets.map((tweet: ITweet, index) => {
                return (
                    <Tweet
                        key={tweet.id}
                        tweet={tweet}
                        index={index}
                        setTweet={setTweet}
                    />
                )
            })
        } else {
            return <p>No tweets yet 🙁</p>
        }
    }, [tweets])

    return (
        <div
            className="w-full grid grid-rows-[60vh_1fr] gap-5 items-start lg:grid lg:grid-cols-[25vw_1fr] lg:h-[calc(100vh-6rem)]"
        >
            <div
                className="h-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center"
            >
                <Avatar
                    isBordered
                    radius='full'
                    src={profileData?.profilePicture}
                    alt='ProfilePicture'
                    className="w-32 h-32 text-large"
                />
                <div
                    className="flex flex-col gap-2 items-center justify-center grow"
                >
                    <p>{profileData?.name}</p>
                    <p>@{profileData?.displayName}</p>
                    <p>
                        {profileData?.description}
                    </p>
                </div>
            </div>


            <div
                className="w-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-5 md:row-span-2 md:overflow-y-auto"
            >
                {renderTweets()}
            </div>
        </div>
    )
}