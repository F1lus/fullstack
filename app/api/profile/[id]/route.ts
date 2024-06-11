'use server'

import {ProfileParams} from "@/app/api/profile/definitions";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {getProfileInfo} from "@/app/lib/profile/profileDbManager";
import {Reply} from "@/app/lib/api/Reply";


export async function GET(request: Request, {params: {id}}: ProfileParams) {
    try {
        const profile = await getProfileInfo(id)

        return Reply.send({profile})
    } catch (error) {
        return ErrorHandler(error)
    }
}