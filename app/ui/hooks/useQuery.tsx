'use client'

import {HTTPMethod} from "@/app/lib/definitions";
import {Query} from "@/app/lib/api/Query";
import {tap} from "rxjs";
import {useRouter} from "next/navigation";
import useLoading from "@/app/ui/hooks/useLoading";
import useNotification from "@/app/ui/hooks/useNotification";
import {NotificationType} from "@/app/ui/context/NotificationContext";

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

    function setupQuery(params: IQueryParams) {
        const builder = new Query(params.URL)
        builder.withMethod(params.method)

        if (params.authorized) {
            builder.withAuthorization()
        }

        if (params.method !== 'GET') {
            builder.withBody(params.body)
        }

        return builder
    }

    function buildQuery<T = any>(params: IQueryParams) {
        const builder = setupQuery(params)
        return builder.build<T>()
            .pipe(
                tap({
                    next: _ => {
                        setIsLoading(false)
                    },
                    error: err => {
                        if(err.status === 401) {
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
    }

    return buildQuery
}