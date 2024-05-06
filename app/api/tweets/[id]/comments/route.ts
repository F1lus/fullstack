import {TweetParams} from "@/app/api/tweets/[id]/definitions";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {createComment, getAllCommentsForTweet} from "@/app/lib/comment/commentDbManager";
import {Reply} from "@/app/lib/api/Reply";
import {parseForm} from "@/app/lib/util/FormHandler";
import {getUserFromSession} from "@/app/lib/util/SessionHandler";

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

export async function POST(request: Request, { params: { id } }: TweetParams) {
    try {
        const formData = await parseForm(request)
        const user = await getUserFromSession()
        const text = formData.get('text') as string

        await createComment(id, user.id, text)

        return Reply.send()
    } catch (error) {
        return ErrorHandler(error)
    }
}