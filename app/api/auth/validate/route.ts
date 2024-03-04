import { JSONResponse } from "@/app/lib/api/JSONResponse"
import { isAuthorizationHeaderValid } from "@/app/lib/auth/SessionHandler"

export const dynamic = 'force-dynamic'

export async function GET(_: Request) {
    const isLoggedIn = await isAuthorizationHeaderValid()
    return JSONResponse.status(isLoggedIn ? 200 : 401).send()
}