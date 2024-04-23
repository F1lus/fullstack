import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {deleteUserSession} from "@/app/lib/auth/authDbManager";
import {getUserFromSession} from "@/app/lib/util/SessionHandler";
import {Reply} from "@/app/lib/api/Reply";

export async function DELETE() {
    try {
        const user =  await getUserFromSession()
        await deleteUserSession(user.id)
        return Reply.send()
    } catch (error) {
        return ErrorHandler(error)
    }
}