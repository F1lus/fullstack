'use server'

import { type NextRequest, NextResponse} from "next/server";
import {SecurityFilter} from "@/app/lib/util/SecurityFilter";

export async function middleware(request: NextRequest) {
    const securityFilter = new SecurityFilter(request)
    const isSameReferer = request.headers.get('referer') === request.nextUrl.href

    if (await securityFilter.isCurrentUrlPublic() || isSameReferer) {
        return NextResponse.next()
    }

    const nextURL = await securityFilter.getNextUrl()
    if(!nextURL) {
        return NextResponse.next()
    }

    return NextResponse.redirect(nextURL)
}