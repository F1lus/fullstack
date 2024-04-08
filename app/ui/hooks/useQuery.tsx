'use client'

import {HTTPMethod} from "@/app/lib/definitions";
import {useMemo} from "react";
import {Query} from "@/app/lib/api/Query";
import {catchError, of} from "rxjs";
import useError from "@/app/ui/hooks/useError";
import {useRouter} from "next/navigation";

interface IQueryParams {
    method: HTTPMethod,
    URL: string,
    body?: any,
    authorized?: boolean
}

export default function useQuery<T = any>(params: IQueryParams) {
    const [
        _,
        setError
    ] = useError()

    const router = useRouter()

    const query = useMemo(() => {
        const builder = new Query(params.URL)
        builder.withMethod(params.method)

        if(params.authorized) {
            builder.withAuthorization()
        }

        if(params.method !== 'GET') {
            builder.withBody(params.body)
        }

        return builder
    }, [params])

    return useMemo(() => {
        return query.build<T>()
            .pipe(
                catchError(err => {
                    if(err.status >= 400) {
                        router.push('/auth/login')
                        return of()
                    }

                    if (err.formError) {
                        setError({formError: err.formError})
                    } else {
                        setError({error: err.error})
                    }

                    return of()
                })
            )
    }, [query, router, setError])
}