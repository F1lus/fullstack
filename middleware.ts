'use server'

import { type NextRequest, NextResponse} from "next/server";
import {SecurityFilter} from "@/app/lib/util/SecurityFilter";

export async function middleware(request: NextRequest) {
    const securityFilter = new SecurityFilter(request)

    if (await securityFilter.isCurrentUrlPublic()) {
        return NextResponse.next()
    }

    return await securityFilter.createResponse()
}