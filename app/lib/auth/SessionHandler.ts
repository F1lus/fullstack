'use server'

import {headers} from "next/headers"
import { decryptToken } from "../token/JWT"
import { deleteUserSession, getUserSession } from "./authDbManager"
import { SessionCookie } from "../definitions"

async function destroySession(userId: string) {
    await deleteUserSession(userId)
}

export async function isAuthorizationHeaderValid() {
    const bearerToken = headers().get('Authorization')
    if(!bearerToken) {
        return false
    }

    const token = bearerToken.split(' ')[1]
    
    const decryptedToken = await decryptToken<SessionCookie>(token)
    if(!decryptedToken) {
        return false
    }

    const id = decryptedToken!.id
    try {
        const user = await getUserSession(id)
        if(user.session?.token !== token){
            return false
        }
        
        return !!(await decryptToken(user.session.token))
    } catch {
        await destroySession(id)
        return false
    }
}