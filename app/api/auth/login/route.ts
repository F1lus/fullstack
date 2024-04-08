import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {FormHandler, parseForm} from "@/app/lib/util/FormHandler";
import {AUTHORIZATION, LoginForm} from "@/app/lib/definitions";
import {AppError} from "@/app/lib/api/error/AppError";
import {createUserSession, deleteUserSession, findUserByLogin} from "@/app/lib/auth/authDbManager";
import {createToken, decryptToken} from "@/app/lib/token/JWT";
import {Reply} from "@/app/lib/api/Reply";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export async function GET() {
    redirect('../auth/login')
}

export async function POST(request: Request) {
    try {
        const formData = await parseForm(request)
        const formHandler = FormHandler(formData)

        if (!formHandler.validator.hasEveryKey(Object.keys(LoginForm))) {
            throw new AppError("The request cannot be processed", 406)
        }

        formHandler.validator.testValues(LoginForm)

        const [email, password] = formHandler.extractValues(LoginForm)
        const user = await findUserByLogin(email, password)

        if (user.session) {
            if (await decryptToken(user.session.token)) {
                cookies().set(AUTHORIZATION, user.session.token)
                return Reply.send({
                    token: user.session.token
                })
            } else {
                await deleteUserSession(user.id)
            }
        }

        const token = await createToken({
            id: user.id
        })

        await createUserSession(user.id, token)

        cookies().set(AUTHORIZATION, token)
        return Reply.send({token})
    } catch (error) {
        return ErrorHandler(error)
    }
}
