'use server'

import {headers} from "next/headers"
import {decryptToken} from "../token/JWT"
import {deleteUserSession, getUserById, getUserSession} from "../auth/authDbManager"
import {AUTHORIZATION, SessionCookie} from "../definitions"
import {AppError} from "@/app/lib/api/error/AppError";

async function destroySession(userId: string) {
    await deleteUserSession(userId)
}

export async function getDecryptedSession() {
    const bearerToken = headers().get(AUTHORIZATION)
    if (!bearerToken) {
        throw new AppError('The session token is invalid!', 401)
    }

    const token = bearerToken.split(' ')[1]

    const decryptedToken = await decryptToken<SessionCookie>(token)
    if (!decryptedToken) {
        throw new AppError('Session could not be decrypted!', 400)
    }

    return decryptedToken
}

export async function isAuthorizationHeaderValid() {
    const decryptedToken = await getDecryptedSession()

    const id = decryptedToken!.id
    try {
        const user = await getUserSession(id)
        if (!user.session?.token) {
            return false
        }

        return !!(await decryptToken(user.session.token))
    } catch {
        await destroySession(id)
        return false
    }
}

export async function getUserFromSession() {
    const decryptedToken = await getDecryptedSession()

    const id = decryptedToken!.id

    return await getUserById(id)
}