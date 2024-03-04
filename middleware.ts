'use server'

import {NextRequest, NextResponse} from "next/server";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname
    const origin = request.nextUrl.origin
    const authorization = request.headers.get('Authorization')

    console.log('Middleware called for:', url)

    try {
        const response = await fetch(`${origin}/api/auth/validate`, {
            headers: {
                'Authorization': `${authorization}`
            }
        })
        const isLoggedIn = response.status === 200


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
                return NextResponse.redirect(redirectUrl)
            }
            //#endregion
        }
    } catch (err){
        console.error('Middleware:', 'Authentication failed!', err)
        return NextResponse.error()
    }
}