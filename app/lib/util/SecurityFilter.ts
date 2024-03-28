'use server'

import {type NextRequest} from "next/server";
import {Query} from "@/app/lib/api/Query";
import {AUTHORIZATION} from "@/app/lib/definitions";
import {firstValueFrom} from "rxjs";

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

        console.log('Security filter is called for:', this.url)
    }

    async authenticate() {
        try {
            const query = new Query('/auth/validate')
            const response = await firstValueFrom<any>(query.withAuthorization(this.authorization).build())

            return response.status === 200
        } catch(error) {
            console.error(error)
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
            return new URL('/home', this.origin)
        }

        if(!isLoggedIn && !this.url.startsWith(authPath)) {
            return new URL(loginPath, this.origin)
        }

        for(const path of this.filters.protectedPaths) {
            const nextPath = `${prefix}/${path}`
            if(isLoggedIn && this.url.startsWith(nextPath)) {
                return new URL(nextPath, this.origin)
            }
        }

        return null
    }

}


