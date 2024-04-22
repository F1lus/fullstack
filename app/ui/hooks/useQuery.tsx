'use client'

import {HTTPMethod} from "@/app/lib/definitions";
import {Query} from "@/app/lib/api/Query";
import {take, tap} from "rxjs";
import {useRouter} from "next/navigation";
import useLoading from "@/app/ui/hooks/useLoading";
import useNotification from "@/app/ui/hooks/useNotification";
import {NotificationType} from "@/app/ui/context/NotificationContext";
import {useCallback} from "react";

export interface IQueryParams {
    method: HTTPMethod,
    URL: string,
    body?: any,
    authorized?: boolean
}

export default function useQuery() {
    const {
        setNotification
    } = useNotification()
    const [
        _,
        setIsLoading
    ] = useLoading();

    const router = useRouter()

    const setupQuery = useCallback((params: IQueryParams) => {
        const builder = new Query(params.URL)
        builder.withMethod(params.method)

        if (params.authorized) {
            builder.withAuthorization()
        }

        if (params.method !== 'GET') {
            builder.withBody(params.body)
        }

        return builder
    }, [])

    return useCallback( <T = any>(params: IQueryParams) => {
        const builder = setupQuery(params)
        return builder.build<T>()
            .pipe(
                take(1),
                tap({
                    next: _ => {
                        setIsLoading(false)
                    },
                    error: err => {
                        if(err.status === 401) {
                            localStorage.removeItem("currentUserId")
                            setNotification({
                                type: NotificationType.WARNING,
                                message: 'You have to log in again!'
                            })
                            router.push('/auth/login')
                        } else {
                            if(err.message) {
                                setNotification({
                                    type: NotificationType.ERROR,
                                    message: err.message
                                })
                            }
                        }
                        setIsLoading(false)
                    }
                })
            )
    }, [router, setIsLoading, setNotification, setupQuery])
}