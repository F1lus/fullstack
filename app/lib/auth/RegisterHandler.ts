import { JSONResponse } from "../api/JSONResponse"
import { RegisterForm, RegisterFormError } from "../definitions"
import { FormHandler } from "../util/FormHandler"
import { findUserByEmail, findUserByUsername, registerUser } from "./authDbManager"

/**
 * Registration process Step 3
 * 
 * Here we do the following before creating the user:
 * - we need to check if the email is already taken
 * - after that, we check if the usernam is already taken
 * - we need to do this so the unique constraint won't fail in the database
 * - if everything is OK (meaning that none of the above is taken), then we create the new user
 * 
 * @param email a unique value in the database
 * @param username a unique value in the database
 * @param displayName 
 * @param password 
 * @returns JSONResponse with status 200
 */
async function createUser(email: string, username: string, displayName: string, password: string) {
    try {
        const isEmailTaken = await findUserByEmail(email)

        if(isEmailTaken) {
            return JSONResponse.status(409)
                .formError({ email: 'This email is already in use' } as RegisterFormError)
        }

        const isUsernameTaken = await findUserByUsername(username)

        if(isUsernameTaken) {
            return JSONResponse.status(409)
                .formError({ username: 'This username is already in use' } as RegisterFormError)
        }

        await registerUser(email, username, displayName, password)

        return JSONResponse.status(200).send()
    } catch (error) {
        return JSONResponse.status(400)
            .error('Could not create user, please try again later')
    }
}

/**
 * Registration process Step 2
 * 
 * Here we validate the form data, which means:
 * - we check if every mandatory key is present in the form
 * - if yes, then we validate each and every one of those values
 * - if a problem occurs during the validation, we construct an object:
 * the key of the object is the field, and the value is the error message,
 * and we send this object to the client as a response.
 * - then we extract the relevant data from the form
 * - lastly, we validate if the password is the same as the passwordRepeat
 * 
 * @param formData RegisterForm
 * @returns Step 3 = Creating the user
 */
async function validateForm(formData: FormData) {
    const formHandler = FormHandler(formData)

    if(!formHandler.validator.hasEveryKey(Object.keys(RegisterForm))) {
        return JSONResponse.status(406)
            .error('Some of the fields are empty!')
    }

    const testValues = formHandler.validator.testValues(RegisterForm)
    if(testValues.isError) {
        return JSONResponse.status(406)
            .formError(testValues.error as RegisterFormError)
    }

    const [
        email,
        username,
        displayName,
        password,
        passwordRepeat
    ] = formHandler.extractValues(RegisterForm)

    if(password !== passwordRepeat) {
        return JSONResponse.status(406)
            .formError({ passwordRepeat: 'The passwords are not the same!' } as RegisterFormError)
    }

    return await createUser(email, username, displayName, password)
}

/**
 * This is the entry point of the registration (Step 1)
 * 
 * In this step we initialize the form data
 * 
 * @param request 
 * @returns Step 2 = validating the fields
 */
export async function registerHandler(request: Request) {
    let formData
    try {
        formData = await request.formData()
    } catch (error) {
        return JSONResponse.status(400)
            .error('Cannot parse Form Data!')
    }

    return await validateForm(formData)
}