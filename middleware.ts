'use server'

import {NextRequest, NextResponse} from "next/server";
import {Transfer} from "./app/lib/api/transfer";

export async function middleware(request: NextRequest) {
    const {isLoggedIn} = await (await Transfer('/auth/validate')).get()
    const url = request.nextUrl.pathname
    const origin = request.nextUrl.origin

    console.log('Middleware called for:', url)

    if (url.startsWith('/_next') || url.startsWith('/images')) {
        return NextResponse.next()
    }

    if (url.startsWith('/api')) {
        //#region API
        if (isLoggedIn && url.startsWith('/api/auth')) {
            const redirectUrl = new URL('/api', origin)
            return NextResponse.redirect(redirectUrl)
        }

        if (!isLoggedIn && !url.startsWith('/api/auth')) {
            const redirectUrl = new URL('/api/auth/login', origin)
            console.log(redirectUrl.href)
            return NextResponse.redirect(redirectUrl)
        }
        //#endregion
    } else {
        //#region Frontend
        if (isLoggedIn && url.startsWith('/auth')) {
            const redirectUrl = new URL('/', origin)
            return NextResponse.redirect(redirectUrl)
        }

        if (!isLoggedIn && !url.startsWith('/auth')) {
            const redirectUrl = new URL('/auth/login', origin)
            console.log(redirectUrl.href)
            return NextResponse.redirect(redirectUrl)
        }
        //#endregion
    }

}