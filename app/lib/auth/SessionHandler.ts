'use server'

import { cookies } from "next/headers"
import { decryptToken } from "../token/JWT"
import { deleteUserSession, getUserSession } from "./authDbManager"
import { SessionCookie } from "../definitions"

const SESSION_COOKIE = 'session'

export async function createSessionCookie(token: string) {
    cookies().set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/'
    })
}

async function destroySession(userId: string) {
    deleteUserSession(userId)
    cookies().delete(SESSION_COOKIE)
}

export async function isCookieSessionValid() {
    const token = cookies().get(SESSION_COOKIE)?.value
    if(!token) {
        return false
    }
    
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
        
        return !!decryptToken(user.session.token)
    } catch {
        await destroySession(id)
        return false
    }
}