'use server'

import {Reply} from "@/app/lib/api/Reply"
import {getUserFromSession} from "@/app/lib/util/SessionHandler"
import {createTweet, getAllTweets, getUserTweets} from "@/app/lib/tweet/tweetDbManager"
import {parseForm} from "@/app/lib/util/FormHandler";
import {NextRequest} from "next/server";
import {FormError} from "@/app/lib/api/error/FormError";
import {AppError} from "@/app/lib/api/error/AppError";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";

export async function POST(request: Request) {
    try {
        const formData = await parseForm(request)
        const user = await getUserFromSession()

        const description = formData.get('description') as string
        if (!description || description.length === 0) {
            throw new FormError({description: 'Description cannot be empty!'})
        }

        const isTweetCreated = await createTweet(user.id, description)
        if (!isTweetCreated) {
            throw new AppError("The tweets could not be created. Please try again!", 406)
        }

        return Reply.withStatus(201).send({
            msg: "The tweets has been created!"
        })
    } catch (error) {
        return ErrorHandler(error)
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const page = searchParams.get('page')
        const userId = searchParams.get('userId')
        const currentUser = await getUserFromSession();

        const pageNumber = !!page ? Number.parseInt(page) : 1

        let tweets
        if(userId) {
            tweets = await getUserTweets(userId, pageNumber)
        } else {
            tweets = await getAllTweets(pageNumber, currentUser.id)
        }

        return Reply.withStatus(200)
            .send({ tweets })
    } catch (error) {
        return ErrorHandler(error)
    }
}