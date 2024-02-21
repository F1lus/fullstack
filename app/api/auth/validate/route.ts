import { JSONResponse } from "@/app/lib/api/JSONResponse"
import { isCookieSessionValid } from "@/app/lib/auth/SessionHandler"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const isLoggedIn = await isCookieSessionValid()
    return JSONResponse.status(200).send({ isLoggedIn })
}