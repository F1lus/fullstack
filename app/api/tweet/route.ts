'use server'

import {Reply} from "@/app/lib/api/Reply"
import {getUserFromSession} from "@/app/lib/util/SessionHandler"
import {createTweet} from "@/app/lib/tweet/tweetDbManager"
import {parseForm} from "@/app/lib/util/FormHandler";

export async function POST(request: Request) {
    const formData = await parseForm(request)
    const user = await getUserFromSession()

    const description = formData.get('description') as string
    if (!description || description.length === 0) {
        return Reply.formError({description: 'Description cannot be empty!'})
    }

    const isTweetCreated = await createTweet(user.id, description)
    if (!isTweetCreated) {
        return Reply.withStatus(406).error("The tweet could not be created. Please try again!")
    }

    return Reply.withStatus(201).send({
        msg: "The tweet has been created!"
    })
}