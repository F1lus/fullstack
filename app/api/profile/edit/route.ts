"use server"

import {FormHandler, parseForm} from "@/app/lib/util/FormHandler";
import {getUserFromSession} from "@/app/lib/util/SessionHandler";
import {ErrorHandler} from "@/app/lib/util/ErrorHandler";
import {ProfileForm} from "@/app/lib/definitions";
import {FormError} from "@/app/lib/api/error/FormError";
import {IRegisterFormError} from "@/app/lib/api/error/ApiError";
import {findOtherUserByEmail} from "@/app/lib/auth/authDbManager";
import {Reply} from "@/app/lib/api/Reply";
import {getProfileData, updateProfile} from "@/app/lib/profile/profileDbManager";
import * as fs from "node:fs";

export async function PATCH(request: Request) {
    try {
        const formData = await parseForm(request)
        const formHandler = FormHandler(formData)

        const user = await getUserFromSession()
        const profileData = await getProfileData(user.id)

        formHandler.validator.testValues(ProfileForm)

        const file = formData.get("profilePicture") as File

        const [
            displayName,
            newEmail,
            description,
            newPassword,
            passwordRepeat,
        ] = formHandler.extractValues(ProfileForm)

        const isEmailTaken = await findOtherUserByEmail(newEmail, user.id)
        if (isEmailTaken) {
            throw new FormError<IRegisterFormError>(
                {
                    email: 'This email is already in use'
                },
                409
            )
        }

        if (newPassword !== passwordRepeat) {
            throw new FormError<IRegisterFormError>(
                {
                    passwordRepeat: 'The passwords are not the same!'
                },
                406
            )
        }

        const path = `/images/profilePictures/${user.id}.png`

        if (file.size > 0) {
            if (file.type.includes('image')) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = new Uint8Array(arrayBuffer);
                console.log('a')
                fs.writeFileSync(`public${path}`, buffer);
                console.log('b')
            } else {
                throw new FormError<IRegisterFormError>(
                    {
                        profilePicture: 'The profile picture format is incorrect'
                    },
                    406
                )
            }
        }

        await updateProfile(
            user.id,
            file.size > 0 ? path : '/profile_ph.webp',
            displayName ?? profileData.displayName,
            newEmail ?? profileData.email,
            description ?? profileData.description,
            profileData.password,
            newPassword
        )
        return Reply.send()

    } catch (error) {
        console.log(error)
        return ErrorHandler(error)
    }
}

export async function GET(_: Request) {
    try {
        const {id} = await getUserFromSession()
        const profile = await getProfileData(id)

        return Reply.send({
            profile
        })
    } catch (error) {
        return ErrorHandler(error)
    }
}