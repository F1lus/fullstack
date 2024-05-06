import {Reply} from "@/app/lib/api/Reply"
import {isAuthorizationHeaderValid} from "@/app/lib/util/SessionHandler"

export const dynamic = 'force-dynamic'

export async function GET() {
    return await (async () => {
        const isLoggedIn = await isAuthorizationHeaderValid()
        return Reply.withStatus(isLoggedIn ? 200 : 401).send()
    })()
}