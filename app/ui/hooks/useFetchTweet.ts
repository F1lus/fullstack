import {ITweet} from "@/app/lib/definitions";
import useQuery, {IQueryParams} from "@/app/ui/hooks/useQuery";
import {useCallback, useEffect, useState} from "react";
import {NotificationType} from "@/app/ui/context/NotificationContext";
import useNotification from "@/app/ui/hooks/useNotification";
import {useRouter} from "next/navigation";

export default function useFetchTweet(id: string) {
    const query$ = useQuery();
    const [tweet, setTweet] = useState<ITweet>();
    const {setNotification} = useNotification()
    const router = useRouter();

    const fetchTweet = useCallback(() => {
        const params: IQueryParams = {
            URL: `/tweets/${id}`,
            method: 'GET',
            authorized: true
        };
        query$<{ tweet: ITweet }>(params).subscribe(({data}) => {
            const {tweet} = data;
            setTweet(tweet);
        });
    }, [id, query$]);

    const notifyError = useCallback(() => {
        setNotification({
            type: NotificationType.ERROR,
            message: "This content could not be found."
        })
        router.replace("/home")
    }, [router, setNotification])

    useEffect(() => {
        if (!id) {
            notifyError()
            return
        }

        fetchTweet()

    }, [fetchTweet, id, notifyError]);

    return {tweet, setTweet};
}