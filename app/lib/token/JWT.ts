'use server'

import jwt from 'jsonwebtoken'
import {type SessionCookie} from '../definitions'

export async function createToken(data: SessionCookie, expiresIn: string = '1 h') {
    const privateKey = process.env['JWT_PRIVATE_KEY'] as string

    return jwt.sign(
        data,
        privateKey,
        {
            expiresIn
        }
    )
}

export async function decryptToken<T = { [key: string]: any }>(token: string) {
    const privateKey = process.env['JWT_PRIVATE_KEY'] as string
    try {
        return jwt.verify(token, privateKey) as T
    } catch {
        return undefined
    }
}