import {FormHandler, parseForm} from "@/app/lib/util/FormHandler";
import {RegisterForm} from "@/app/lib/definitions";
import {AppError} from "@/app/lib/api/error/AppError";
import {FormError} from "@/app/lib/api/error/FormError";
import {IRegisterFormError} from "@/app/lib/api/error/ApiError";
import {findUserByEmail, findUserByUsername, registerUser} from "@/app/lib/auth/authDbManager";
import {Reply} from "@/app/lib/api/Reply";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";

export async function POST(request: Request) {
    try {
        const formData = await parseForm(request)
        const formHandler = FormHandler(formData)

        if (!formHandler.validator.hasEveryKey(Object.keys(RegisterForm))) {
            throw new AppError("The request cannot be processed", 406)
        }

        formHandler.validator.testValues(RegisterForm)

        const [
            email,
            username,
            displayName,
            password,
            passwordRepeat
        ] = formHandler.extractValues(RegisterForm)

        if (password !== passwordRepeat) {
            throw new FormError<IRegisterFormError>(
                {
                    passwordRepeat: 'The passwords are not the same!'
                },
                406
            )
        }

        const isEmailTaken = await findUserByEmail(email)
        if (isEmailTaken) {
            throw new FormError<IRegisterFormError>(
                {
                    email: 'This email is already in use'
                },
                409
            )
        }

        const isUsernameTaken = await findUserByUsername(username)
        if (isUsernameTaken) {
            throw new FormError<IRegisterFormError>(
                {
                    username: 'This username is already in use'
                },
                409
            )
        }

        await registerUser(email, username, displayName, password)
        return Reply.send()
    } catch (error) {
        return ErrorHandler(error);
    }
}