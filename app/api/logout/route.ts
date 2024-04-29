import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {destroySession, getUserFromSession} from "@/app/lib/util/SessionHandler";
import {Reply} from "@/app/lib/api/Reply";

export async function DELETE() {
    try {
        const user = await getUserFromSession()
        await destroySession(user.id)
        return Reply.send()
    } catch (error) {
        return ErrorHandler(error)
    }
}