'use server'

import {Reply} from "@/app/lib/api/Reply"
import {getUserFromSession} from "@/app/lib/util/SessionHandler"
import {createTweet, getAllTweets, getUserTweets} from "@/app/lib/tweet/tweetDbManager"
import {parseForm} from "@/app/lib/util/FormHandler";
import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {AUTHORIZATION} from "@/app/lib/definitions";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";

export async function POST(request: Request) {
    const formData = await parseForm(request)
    const user = await getUserFromSession()

    const description = formData.get('description') as string
    if (!description || description.length === 0) {
        return Reply.formError({description: 'Description cannot be empty!'})
    }

    const isTweetCreated = await createTweet(user.id, description)
    if (!isTweetCreated) {
        return Reply.withStatus(406).error("The tweets could not be created. Please try again!")
    }

    return Reply.withStatus(201).send({
        msg: "The tweets has been created!"
    })
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
    } catch(error) {
        return ErrorHandler(error)
    }
}