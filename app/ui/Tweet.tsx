import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faShareFromSquare} from "@fortawesome/free-regular-svg-icons";
import type {ITweet} from "@/app/lib/definitions";
import {Query} from "@/app/lib/api/Query";
import {useState} from "react";

interface TweetProps {
    tweet: ITweet,
    index: number,
    setTweet: (index: number, tweet: ITweet) => void
}

export default function Tweet(tweetProps: TweetProps) {

    const [
        isTweetLiked,
        setTweetLiked
    ] = useState<boolean>(tweetProps.tweet.likes.length == 1)

    const renderInnerTweet = () => {
        if (tweetProps.tweet.originalTweet) {
            return (
                <Tweet
                    tweet={tweetProps.tweet.originalTweet}
                    index={tweetProps.index}
                    setTweet={tweetProps.setTweet}
                />
            )
        }
    }

    const handleLike = async () => {
        const query = new Query(`tweets/${tweetProps.tweet.id}/toggleLike`)
        query.withAuthorization()
            .withMethod('PATCH')
            .withBody(tweetProps)
            .build<{ isTweetLiked: boolean }>()
            .subscribe(({ data }) => {
                const tweet = tweetProps.tweet
                tweet._count.likes += data.isTweetLiked ? 1 : -1
                tweetProps.setTweet(tweetProps.index, tweet)
                setTweetLiked(data.isTweetLiked)
            })
    }

    return (
        <div
            className="w-full h-full flex flex-col items-center gap-10 p-5 shadow-lg lg:w-1/3 lg:rounded-md bg-white"
        >
            <div
                className="w-full h-full flex items-start lg:w-4/5"
            >
                <Image
                    src={tweetProps.tweet.Owner.profilePicturePath}
                    alt="profile picture"
                    width={64}
                    height={64}
                    priority

                    className="rounded-full"
                />

                <div
                    className="flex flex-col items-start gap-1 mx-2 my-auto"
                >
                    <p className="font-bold">@{tweetProps.tweet.Owner.displayName}</p>
                    <p>{new Date(tweetProps.tweet.modifiedAt).toDateString()}</p>
                </div>
            </div>

            <div
                className="w-full h-full items-start lg:w-4/5"
            >
                <p>
                    {tweetProps.tweet.description}
                </p>

                {renderInnerTweet()}

                <div
                    className="w-full h-full flex flex-cols justify-between text-[1.5em] pt-5 text-center"
                >
                    <button
                        onClick={handleLike}
                    >
                        <FontAwesomeIcon
                            icon={faHeart}
                            color={isTweetLiked ? 'red' : undefined}
                        />
                        <p>
                            {tweetProps.tweet._count.likes}
                        </p>
                    </button>

                    <button
                    >
                        <FontAwesomeIcon icon={faShareFromSquare}/>
                        <p>
                            {tweetProps.tweet._count.retweets}
                        </p>
                    </button>

                    <button
                    >
                        <FontAwesomeIcon icon={faComment}/>
                        <p>
                            {tweetProps.tweet._count.comments}
                        </p>
                    </button>

                </div>
            </div>
        </div>
    )
}