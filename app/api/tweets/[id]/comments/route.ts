import {TweetParams} from "@/app/api/tweets/[id]/definitions";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {getAllCommentsForTweet} from "@/app/lib/comment/commentDbManager";
import {Reply} from "@/app/lib/api/Reply";

export async function GET(request: Request, { params: { id } }: TweetParams) {
    try {
        const comments = await getAllCommentsForTweet(id)
        if(!comments) {
            return Reply.send({ comments: [] })
        }

        return Reply.send({ comments })
    } catch (error) {
        return ErrorHandler(error)
    }
}