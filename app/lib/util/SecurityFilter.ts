'use server'

import {type NextRequest} from "next/server";
import {Query} from "@/app/lib/api/Query";
import {AUTHORIZATION} from "@/app/lib/definitions";

export class SecurityFilter {

    private readonly filters = Object.freeze({
        publicPaths: ['/_next', '/images'],
        protectedPaths: ['/home']
    })

    private readonly origin: string
    private readonly authorization: string
    private readonly url: string

    constructor(request: NextRequest) {
        this.origin = request.nextUrl.origin
        this.authorization = request.cookies.get(AUTHORIZATION)?.value ?? ''
        this.url = request.nextUrl.pathname

        console.log(this.authorization)
        console.log('Security filter is called for:', this.url)
    }

    async authenticate() {
        try {
            const query = new Query('/auth/validate')
            const response = await query.withAuthorization(this.authorization)
                .send()

            return response.status === 200
        } catch {
            return false
        }
    }

    async isCurrentUrlPublic() {
        return this.filters
            .publicPaths
            .some(
                publicPath => this.url.startsWith(publicPath)
            )
    }

    async getNextUrl() {
        const isApi = this.url.startsWith('/api')
        const prefix = isApi ? '/api' : ''
        const isLoggedIn = await this.authenticate()

        const authPath = `${prefix}/auth`
        const loginPath = `${authPath}/login`

        if(isLoggedIn && this.url.startsWith(authPath)) {
            console.log(1)
            return new URL('/home', this.origin)
        }

        if(!isLoggedIn && !this.url.startsWith(authPath)) {
            console.log(2)
            return new URL(loginPath, this.origin)
        }

        for(const path of this.filters.protectedPaths) {
            const nextPath = `${prefix}/${path}`
            if(isLoggedIn && this.url.startsWith(nextPath)) {
                console.log(3)
                return new URL(nextPath, this.origin)
            }
        }

        console.log(4)
        return null
    }

}


