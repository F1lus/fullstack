'use server'

import {TweetParams} from "@/app/api/tweets/[id]/definitions";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {getUserFromSession} from "@/app/lib/util/SessionHandler";
import {toggleTweetLike} from "@/app/lib/tweet/tweetDbManager";
import {AppError} from "@/app/lib/api/error/AppError";
import {Reply} from "@/app/lib/api/Reply";

export async function PATCH(_: Request, {params}: TweetParams) {
    try {
        const {id} = params
        const user = await getUserFromSession()

        const didUpdate = await toggleTweetLike(id, user.id)
        if (!didUpdate) {
            throw new AppError('You cannot like/unlike this tweets right now')
        }

        return Reply.send()
    } catch (error) {
        return ErrorHandler(error)
    }
}