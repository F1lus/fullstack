import {Reply} from "@/app/lib/api/Reply"
import {isAuthorizationHeaderValid} from "@/app/lib/util/SessionHandler"
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const isLoggedIn = await isAuthorizationHeaderValid()
        return Reply.withStatus(isLoggedIn ? 200 : 401).send()
    } catch (error) {
        return ErrorHandler(error)
    }
}