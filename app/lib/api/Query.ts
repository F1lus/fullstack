import {AUTHORIZATION, ContentType, HTTPMethod} from "../definitions"

export class Query {

    private readonly requestInit: RequestInit
    private readonly headers: Headers
    private readonly path: string

    constructor(path: string) {
        const pathSeparator = path.startsWith('/') ? '' : '/'
        this.path = `${this.origin}/api${pathSeparator}${path}`

        this.headers = new Headers()
        this.requestInit = {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            headers: this.headers
        }
    }

    get origin() {
        const isProduction = process.env['NODE_ENV'] === 'production'
        if (isProduction) {
            return this.isServer ? `https://${process.env['VERCEL_URL']}` : window.location.origin
        }

        return this.isServer ? 'http://localhost:3000' : window.location.origin
    }

    private get isServer() {
        return typeof window === 'undefined'
    }

    /**
     * Tells the query builder to add authentication header
     * In a client component, the authentication token is
     * received from the cookie, with an Authorization key
     *
     * @param token only use this if you need a special token, or you're in a server component
     * and need authentication
     */
    withAuthorization(token?: string) {
        const clientToken = this.isServer ? token : sessionStorage.getItem(AUTHORIZATION)
        if (token) {
            return this.withCookie(AUTHORIZATION, token ?? '')
        }

        return this.withCookie(AUTHORIZATION, clientToken ?? '')
    }

    withContentType(contentType: ContentType) {
        return this.withHeader('Content-Type', contentType)
    }

    withMethod(httpMethod: HTTPMethod) {
        this.requestInit.method = httpMethod
        return this
    }

    withBody(body: any) {
        if (this.requestInit.method === 'GET') {
            throw new Error('GET Request cannot have a body!')
        }

        this.requestInit.body = body
        return this
    }

    withHeader(key: string, value: string) {
        this.headers.set(key, value)
        return this
    }

    withCookie(key: string, value: string) {
        this.headers.set('Cookie', `${key}=${value}`)
        return this
    }

    async send<T = any>() {
        console.log(this.path)
        const response = await fetch(this.path, this.requestInit)
        const data: T & { error?: string } = await response.json()

        return {
            status: response.status,
            statusText: response.statusText,
            data
        }
    }
}
