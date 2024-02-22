'use server'

import {cookies} from "next/headers"
import {ContentType, HTTPMethod} from "../definitions"

function getOrigin() {
    const isProduction = process.env['NODE_ENV'] === 'production'
    const isServer = typeof window === 'undefined'

    if (isProduction) {
        return isServer ? process.env['VERCEL_URL'] : window.location.origin
    }

    return isServer ? 'http://localhost:3000' : window.location.origin
}

/**
 * An improved fetch
 *
 * @param path
 * @param contentType
 * @returns a guaranteed JSON structure which you can even narrow down
 */
export async function Transfer(path: string, contentType: ContentType = 'application/json') {
    const pathSeparator = path.startsWith('/') ? '' : '/'
    const localPath: string = `${getOrigin()}/api${pathSeparator}${path}`

    const cookieHeaderFormat = cookies().getAll()
        .map(a => `${a.name}=${a.value}`)
        .join(';')
    const init: RequestInit = {
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-Type': contentType,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    }

    async function sendRequest(method: HTTPMethod, data: object = {}) {
        init.method = method
        if (method !== 'GET') {
            init.body = JSON.stringify(data)
        }

        try {
            const response = await fetch(localPath, init)

            return await response.json()
        } catch {
            return {}
        }
    }

    return {
        get: async () => await sendRequest('GET'),
        post: async (data: object = {}) => await sendRequest('POST', data),
        put: async (data: object = {}) => await sendRequest('PUT', data),
        patch: async (data: object = {}) => await sendRequest('PATCH', data),
        delete: async (data: object = {}) => await sendRequest('DELETE', data),
        options: async (data: object = {}) => await sendRequest('OPTIONS', data),
    }
}
