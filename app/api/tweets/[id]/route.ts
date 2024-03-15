'use server'

import {Reply} from "@/app/lib/api/Reply"
import {deleteTweet, getTweet, modifyTweet, retweet} from "@/app/lib/tweet/tweetDbManager"
import {getUserFromSession} from "@/app/lib/util/SessionHandler";
import {AppError} from "@/app/lib/api/error/AppError";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {parseForm} from "@/app/lib/util/FormHandler";
import {TweetParams} from "@/app/api/tweets/[id]/definitions";
import {FormError} from "@/app/lib/api/error/FormError";

/**
 * Retrieve a tweets by ID
 *
 * @param request
 * @param param
 * @returns
 */
export async function GET(request: Request, {params: {id}}: TweetParams) {
    const tweet = await getTweet(id)

    if (!tweet) {
        throw new AppError('Tweet not found!', 404)
    }

    return Reply.send({tweet})
}

export async function DELETE(request: Request, {params: {id}}: TweetParams) {
    try {
        const user = await getUserFromSession()
        const isDeleted = await deleteTweet(id, user.id)

        if (!isDeleted) {
            throw new AppError('The tweets could not be deleted!')
        }

        return Reply.withStatus(200).send()
    } catch (error) {
        return ErrorHandler(error)
    }
}

export async function PATCH(request: Request, {params: {id}}: TweetParams) {
    try {
        const formData = await parseForm(request)
        const user = await getUserFromSession()

        const description = formData.get('description') as string

        const didTweetModify = await modifyTweet(id, user.id, description)
        if (!didTweetModify) {
            throw new FormError({description: 'The tweets could not be modified'})
        }

        return Reply.send({msg: "The tweets has been modified"})
    } catch (error) {
        return ErrorHandler(error)
    }
}

export async function POST(request: Request, {params: {id}}: TweetParams) {
    try {
        const formData = await parseForm(request)
        const user = await getUserFromSession()

        const description = formData.get('description') as string

        const isCreated = await retweet(id, user.id, description)
        if (!isCreated) {
            throw new FormError({description: 'You cannot retweet this right now'})
        }

        return Reply.withStatus(201).send({
            msg: "The tweets has been created!"
        })
    } catch (error) {
        return ErrorHandler(error)
    }
}
