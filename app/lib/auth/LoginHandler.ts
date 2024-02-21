'use server'

import { JSONResponse } from "@/app/lib/api/JSONResponse"
import { createUserSession, deleteUserSession, findUserByLogin } from "@/app/lib/auth/authDbManager"
import { createToken, decryptToken } from "@/app/lib/token/JWT"
import { FormHandler } from "../util/FormHandler"
import { LoginForm, LoginFormError } from "../definitions"
import { createSessionCookie } from "./SessionHandler"

export async function loginHandler(request: Request) {
    let formData
    try {
        formData = await request.formData()
    } catch (error) {
        return JSONResponse.status(400)
            .error('Cannot parse Form Data!')
    }

    const formHandler = FormHandler(formData)

    if(!formHandler.validator.hasEveryKey(Object.keys(LoginForm))) {
        return JSONResponse.status(400)
            .error('Email or Password field is empty!')
    }

    const testValues = formHandler.validator.testValues(LoginForm)
    if(testValues.isError) {
        return JSONResponse.status(400)
            .formError(testValues.error as LoginFormError)
    }
    
    const [ email, password ] = formHandler.extractValues(LoginForm)

    try {
        const user = await findUserByLogin(email, password)
        if(user.session) {
            if(await decryptToken(user.session.token)) {
                createSessionCookie(user.session.token)
                return JSONResponse.status(200).send()
            } else {
                deleteUserSession(user.id)
            }
        }

        const token = await createToken({
            id: user.id
        })
        
        await createUserSession(user.id, token)
        createSessionCookie(token)

        return JSONResponse.status(200)
            .send({ token })
    } catch(error) {
        return JSONResponse.status(401)
            .error('The email or password is invalid!')
    }
}