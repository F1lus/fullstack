'use server'

import {TweetParams} from "@/app/api/tweets/[id]/definitions";
import {getUserFromSession} from "@/app/lib/util/SessionHandler";
import {toggleTweetLike} from "@/app/lib/tweet/tweetDbManager";
import {AppError} from "@/app/lib/api/error/AppError";
import {Reply} from "@/app/lib/api/Reply";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";

export async function PATCH(_: Request, {params}: TweetParams) {
    try {
        const {id} = params
        const user = await getUserFromSession()

        const isTweetLiked = await toggleTweetLike(id, user.id)
        if (isTweetLiked === undefined) {
            throw new AppError('You cannot like/unlike this tweets right now')
        }

        return Reply.send({ isTweetLiked })
    } catch (error) {
        return ErrorHandler(error)
    }
}