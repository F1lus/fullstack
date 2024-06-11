'use client'

import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {useCallback, useEffect, useState} from "react";
import {ProfileData} from "@/app/lib/definitions";
import {Avatar} from "@nextui-org/avatar";
import {Textarea} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import useLoading from "@/app/ui/hooks/useLoading";
import {useRouter} from "next/navigation";
import {NotificationType} from "@/app/ui/context/NotificationContext";
import useNotification from "@/app/ui/hooks/useNotification";

export default function CreateTweetPage() {

    const query$ = useQuery()
    const router = useRouter()
    const {setNotification} = useNotification()

    const [profileData, setProfileData] = useState<ProfileData>()
    const [loading, setLoading] = useLoading()

    useEffect(() => {
        const userId = localStorage.getItem('currentUserId')

        const queryParams: IQueryParams = {
            URL: `/profile/${userId}`,
            method: 'GET',
            authorized: true
        }

        query$(queryParams).subscribe(({data: {profile}}) => {
            setProfileData(profile)
        })
    }, [query$])

    const notifyError = useCallback(() => {
        setNotification({
            type: NotificationType.ERROR,
            message: "This content could not be found."
        })
    }, [setNotification])

    const handleSubmit = (formData: FormData) => {
        const queryParams: IQueryParams = {
            URL: '/tweets',
            method: 'POST',
            authorized: true,
            body: formData
        }

        setLoading(true)

        query$<void>(queryParams).subscribe({
            next: () => {
                setLoading(false)
                router.push("/home")
            },
            error: () => {
                notifyError()
                setLoading(false)
            }
        })
    }

    return (
        <div
            className="w-full flex flex-col gap-5 bg-white rounded-xl shadow-lg p-6 lg:w-1/3">
            <div className='flex gap-5'>
                <Avatar
                    isBordered
                    radius='full'
                    size='md'
                    src={profileData?.profilePicturePath}
                    alt='ProfilePicture'
                />
                <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                        {profileData?.displayName}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                        @{profileData?.name}
                    </h5>
                </div>
            </div>

            <form className="w-full h-full flex flex-col gap-5" action={handleSubmit}>
                <Textarea
                    name="description"
                    placeholder="What's happening?"
                    variant="bordered"
                    isRequired

                    className='w-full'
                />

                <Button
                    radius="full"
                    color="success"
                    variant="shadow"
                    type="submit"
                    isLoading={loading}
                >
                    Create post
                </Button>
            </form>
        </div>
    )
}