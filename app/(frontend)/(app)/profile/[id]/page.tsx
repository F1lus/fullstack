"use client"

import {Avatar} from "@nextui-org/avatar";
import {useCallback, useEffect, useState} from "react";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {ITweet, ProfileData} from "@/app/lib/definitions";
import Tweet from "@/app/ui/tweet/Tweet";
import {switchMap} from "rxjs";
import {useParams} from "next/navigation";
import {FaUserEdit as EditIcon} from "react-icons/fa";
import Link from "next/link";
import {Button} from "@nextui-org/react";

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

    }, [query$, userId])

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
            className="w-full grid grid-rows-[40vh_1fr] gap-5 items-start lg:grid lg:grid-cols-[25vw_1fr] lg:h-[calc(100vh-6rem)]"
        >
            <div
                className="h-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center"
            >
                <Avatar
                    isBordered
                    radius='full'
                    src={profileData?.profilePicturePath}
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

                <Link href="/profile/edit">
                    <Button variant="faded">
                        <EditIcon className="text-[2em]"/>
                        Edit profile
                    </Button>
                </Link>
            </div>


            <div
                className="h-full w-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-5 md:row-span-2 md:overflow-y-auto"
            >
                {renderTweets()}
            </div>
        </div>
    )
}