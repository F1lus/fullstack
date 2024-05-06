'use server'

import {type NextRequest, NextResponse} from "next/server";
import {Query} from "@/app/lib/api/Query";
import {AUTHORIZATION} from "@/app/lib/definitions";
import {lastValueFrom} from "rxjs";

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

        // console.log('Security filter is called for:', this.url)
    }

    async authenticate() {
        try {
            const query = new Query('/auth/validate')
            const response = await lastValueFrom<any>(query.withAuthorization(this.authorization).build())

            return response.status === 200
        } catch(error) {
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

    async createResponse() {
        const isAPI = this.url.startsWith('/api')
        const isAuthenticated = await this.authenticate()

        return isAPI ?
            this.filterAPI(isAuthenticated)
            :
            this.filterFrontEnd(isAuthenticated)
    }

    private async filterAPI(isAuthenticated: boolean) {
        if(!isAuthenticated && !this.url.startsWith('/api/auth')) {
            return NextResponse.json("Access Denied!", { status: 401 })
        }
        return NextResponse.next()
    }

    private async filterFrontEnd(isAuthenticated: boolean) {
        const auth = '/auth' as const
        const login = `${auth}/login` as const
        const home = '/home' as const

        if(!isAuthenticated && !this.url.startsWith(auth)) {
            const loginURL = new URL(login, this.origin)
            return NextResponse.redirect(loginURL)
        }

        if(isAuthenticated && this.url.startsWith(auth)) {
            const homeURL = new URL(home, this.origin)
            return NextResponse.redirect(homeURL)
        }

        return NextResponse.next()
    }

}


