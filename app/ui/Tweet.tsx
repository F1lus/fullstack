import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faShareFromSquare} from "@fortawesome/free-regular-svg-icons";
import type {ITweet} from "@/app/lib/definitions";
import {useState} from "react";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Avatar} from "@nextui-org/avatar";
import {motion} from "framer-motion";

interface TweetProps {
    tweet: ITweet,
    index: number,
    isRetweet?: boolean,
    setTweet: (index: number, tweet: ITweet) => void
}

export default function Tweet(tweetProps: TweetProps) {

    const query$ = useQuery()

    const [
        isTweetLiked,
        setTweetLiked
    ] = useState<boolean>(tweetProps.tweet.likes.length === 1)

    const renderInnerTweet = () => {
        if (tweetProps.tweet.originalTweet) {
            return (
                <Tweet
                    tweet={tweetProps.tweet.originalTweet}
                    index={tweetProps.index}
                    setTweet={tweetProps.setTweet}
                    isRetweet={true}
                />
            )
        }
    }

    const handleLike = async () => {
        const params: IQueryParams = {
            URL: `tweets/${tweetProps.tweet.id}/toggleLike`,
            method: 'PATCH',
            authorized: true,
            body: tweetProps
        }

        query$<{ isTweetLiked: boolean }>(params)
            .subscribe(({data}) => {
                const tweet = tweetProps.tweet
                tweet._count.likes += data.isTweetLiked ? 1 : -1
                tweetProps.setTweet(tweetProps.index, tweet)
                setTweetLiked(data.isTweetLiked)
            })
    }

    function displayFooter() {
        if (!tweetProps.isRetweet) {
            return (
                <CardFooter className='gap-x-20 justify-center'>
                    <button
                        className="flex gap-1"
                        onClick={handleLike}
                    >
                        <FontAwesomeIcon
                            className='font-semibold text-large'
                            icon={faHeart}
                            color={isTweetLiked ? 'red' : undefined}
                        />
                        <p className="font-semibold text-default-400 text-small">
                            {tweetProps.tweet._count.likes}
                        </p>
                    </button>
                    <button
                        className="flex gap-1"
                    >
                        <FontAwesomeIcon
                            className='font-semibold text-large'
                            icon={faComment}
                        />
                        <p className="font-semibold text-default-400 text-small">
                            {tweetProps.tweet._count.comments}
                        </p>
                    </button>
                    <button
                        className="flex gap-1"
                    >
                        <FontAwesomeIcon
                            className='font-semibold text-large'
                            icon={faShareFromSquare}
                        />
                        <p className="font-semibold text-default-400 text-small">
                            {tweetProps.tweet._count.retweets}
                        </p>
                    </button>
                </CardFooter>
            )
        }
    }

    return (
        <motion.div
            whileHover={{
                scale: 1.02
            }}
            whileTap={{
                scale: 0.98
            }}
        >
            <Card className="max-w-[450px]">
                <CardHeader className="justify-between">
                    <div className='flex gap-5'>
                        <Avatar
                            isBordered
                            radius='full'
                            size='md'
                            src={tweetProps.tweet.Owner.profilePicturePath}
                            alt='ProfilePicture'
                        />
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">
                                {tweetProps.tweet.Owner.displayName}
                            </h4>
                            <h5 className="text-small tracking-tight text-default-400">
                                @{tweetProps.tweet.Owner.name}
                            </h5>
                        </div>
                    </div>
                    <div>
                        {(new Date(tweetProps.tweet.createdAt)).toDateString()}
                    </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-medium text-default-600">
                    <p>
                        {tweetProps.tweet.description}
                    </p>

                    <div className="my-3">
                        {
                            renderInnerTweet()
                        }
                    </div>
                </CardBody>
                {
                    displayFooter()
                }
            </Card>
        </motion.div>
    )
}