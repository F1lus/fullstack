import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {IComment, ITweet} from "@/app/lib/definitions";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import useNotification from "@/app/ui/hooks/useNotification";
import {NotificationType} from "@/app/ui/context/NotificationContext";

export default function useFetchComments(tweet: ITweet, setTweet: Dispatch<SetStateAction<ITweet | undefined>>) {

    const [comments, setComments] = useState<IComment[]>([])
    const query$ = useQuery()
    const {setNotification} = useNotification()

    const fetchComments = useCallback(() => {
        const params: IQueryParams = {
            URL: `/tweets/${tweet.id}/comments`,
            method: 'GET',
            authorized: true,
        }

        query$<{ comments: IComment[] }>(params).subscribe(({data}) => {
            setComments(data.comments)
        })
    }, [query$, tweet])

    const notifyError = useCallback(() => {
        setNotification({
            type: NotificationType.ERROR,
            message: "An error occurred."
        })
    }, [setNotification])

    const comment = useCallback((comment: FormData) => {
        const params: IQueryParams = {
            URL: `/tweets/${tweet.id}/comments`,
            method: 'POST',
            authorized: true,
            body: comment
        }

        query$<{ res: IComment }>(params).subscribe({
            next: ({data}) => {
                setTweet(tweet => tweet && {
                    ...tweet,
                    _count: {...tweet._count, comments: tweet._count.comments + 1}
                })
                setComments(prevState => [data as unknown as IComment, ...prevState])
            },
            error: notifyError
        })
    }, [tweet.id, query$, notifyError, setTweet])

    useEffect(() => {
        if (tweet) {
            fetchComments()
        }
    }, [fetchComments, tweet])

    return {
        comments,
        comment
    }
}