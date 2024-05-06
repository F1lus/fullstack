'use server'

import {ProfileParams} from "@/app/api/profile/definitions";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {getProfileInfo} from "@/app/lib/profile/profileDbManager";
import {Reply} from "@/app/lib/api/Reply";
import {parseForm} from "@/app/lib/util/FormHandler";
import {getUserFromSession} from "@/app/lib/util/SessionHandler";

export async function GET(request: Request, { params: {id} }: ProfileParams) {
    try {
        const profile = await getProfileInfo(id)

        return Reply.send({ profile })
    } catch (error) {
        return ErrorHandler(error)
    }
}

export async function PATCH(request: Request, { params: {id} }: ProfileParams) {
    try {
        const formData = await parseForm(request)
        const user = await getUserFromSession()



    } catch (error) {
        return ErrorHandler(error)
    }
}