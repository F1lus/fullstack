'use client'

import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {Button, Input} from "@nextui-org/react";
import {Textarea} from "@nextui-org/input";
import useLoading from "@/app/ui/hooks/useLoading";
import {FaCamera as CameraIcon} from "react-icons/fa";
import {useCallback, useEffect, useState} from "react";
import {Email, ProfileData} from "@/app/lib/definitions";


export default function ProfileEditPage() {

    const query$ = useQuery()
    const [loading, setLoading] = useLoading()

    const [profileData, setProfileData] = useState<ProfileData & Email>()

    useEffect(() => {
        const profileParams: IQueryParams = {
            URL: "/profile/edit",
            method: 'GET',
            authorized: true
        }

        query$(profileParams).subscribe({
            next: ({data: {profile}}) => {
                setProfileData(profile)
            }
        })

    }, [query$]);

    const handleSubmit = (formData: FormData) => {
        const params: IQueryParams = {
            URL: "profile/edit",
            method: "PATCH",
            authorized: true,
            body: formData
        }

        setLoading(true)

        query$<{}>(params).subscribe()
    }

    const renderFilledInputs = useCallback(() => {
        if (profileData) {
            return (
                <>
                    <div
                        className="w-[20vw] h-[20vw] rounded-[50%] bg-[#000]/[0.75]"
                    >
                        <label
                            className="w-full h-full cursor-pointer flex flex-col justify-center items-center"
                            htmlFor="profilePicture"
                        >
                            <CameraIcon className="text-[5em] text-[#fff]/[0.4]"/>
                            <input
                                type="file"
                                name="profilePicture"
                                id="profilePicture"
                                className="w-full h-full hidden"
                                accept={"image/jpeg, image/png, image/jpg"}
                            />
                        </label>
                    </div>
                    <Input
                        type="text"
                        name="displayName"
                        label="Display Name"
                        variant="underlined"
                        defaultValue={profileData.displayName}
                    />
                    <Input
                        type="email"
                        name="newEmail"
                        label="Email"
                        variant="underlined"
                        defaultValue={profileData.email}
                    />

                    <Textarea
                        name="description"
                        label="Profile Description"
                        defaultValue={profileData.description}
                    />
                </>
            )
        }
    }, [profileData])

    return (
        <form
            className="w-full h-full bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-5 lg:w-1/3 lg:mx-auto"
            action={handleSubmit}
        >
            {renderFilledInputs()}

            <Input
                type="password"
                name="newPassword"
                label="Password"
                variant="underlined"
            />

            <Input
                type="password"
                name="passwordRepeat"
                label="Password Repeat"
                variant="underlined"
            />

            <Button
                radius="full"
                color="success"
                variant="shadow"
                type="submit"
                isLoading={loading}
            >
                Save
            </Button>

        </form>
    )
}