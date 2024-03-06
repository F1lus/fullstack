'use server'

import {type NextRequest} from "next/server";
import {Query} from "@/app/lib/api/Query";

export class SecurityFilter {

    private readonly filters = Object.freeze({
        publicUrls: ['/_next', '/images'],
        protectedUrls: ['auth']
    })

    private readonly origin: string
    private readonly authorization: string
    private readonly url: string

    constructor(request: NextRequest) {
        this.origin = request.nextUrl.origin
        this.authorization = request.headers.get('Authorization') ?? ''
        this.url = request.nextUrl.pathname

        console.log('Security filter is called for:', this.url)
    }

    async authenticate() {
        try {
            const query = new Query('/auth/validate')
            const response = await query.withAuthorization(this.authorization).send()

            return response.status === 200
        } catch {
            return false
        }
    }

    async isCurrentUrlPublic() {
        return this.filters
            .publicUrls
            .some(
                publicUrl => this.url.startsWith(publicUrl)
            )
    }

    async getNextUrl() {
        const isApi = this.url.startsWith('/api')
        const prefix = isApi ? '/api' : ''
        const isLoggedIn = await this.authenticate()

        for (const protectedUrl of this.filters.protectedUrls) {
            const evaluatedUrl = `${prefix}/${protectedUrl}`

            if (isLoggedIn && this.url.startsWith(evaluatedUrl)) {
                return new URL(`${prefix}/`, this.origin)
            }

            if (!isLoggedIn && !this.url.startsWith(evaluatedUrl)) {
                return new URL(`${prefix}/auth/login`, this.origin)
            }
        }
    }

}


