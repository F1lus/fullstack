import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faShareFromSquare} from "@fortawesome/free-regular-svg-icons";
import type {TweetProps} from "@/app/lib/definitions";
import {Query} from "@/app/lib/api/Query";

export default function Tweet(data: TweetProps) {

    const renderInnerTweet = () => {
        if (data.originalTweet) {
            return (
                <Tweet
                    {...data.originalTweet}
                />
            )
        }
    }

    const handleLike = async () => {
        const query = new Query(`tweets/${data.id}/toggleLike`)
        query.withAuthorization()
            .withMethod('PATCH')
            .withBody(data)
            .build()
            .subscribe(response => {
                console.log(response.data)
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
                    src={data.Owner.profilePicturePath}
                    alt="profile picture"
                    width={64}
                    height={64}
                    priority

                    className="rounded-full"
                />

                <div
                    className="flex flex-col items-start gap-1 mx-2 my-auto"
                >
                    <p className="font-bold">@{data.Owner.displayName}</p>
                    <p>{new Date(data.modifiedAt).toDateString()}</p>
                </div>
            </div>

            <div
                className="w-full h-full items-start lg:w-4/5"
            >
                <p>
                    {data.description}
                </p>

                {renderInnerTweet()}

                <div
                    className="w-full h-full flex flex-cols justify-between text-[1.5em] pt-5 text-center"
                >
                    <button
                        onClick={handleLike}
                    >
                        <FontAwesomeIcon icon={faHeart}/>
                        <p>
                            {data._count.likes}
                        </p>
                    </button>

                    <button
                    >
                        <FontAwesomeIcon icon={faShareFromSquare}/>
                        <p>
                            {data._count.retweets}
                        </p>
                    </button>

                    <button
                    >
                        <FontAwesomeIcon icon={faComment}/>
                        <p>
                            {data._count.comments}
                        </p>
                    </button>

                </div>
            </div>
        </div>
    )
}