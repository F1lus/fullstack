import {useCallback, useContext} from "react";
import {INotification, NotificationContext} from "@/app/ui/context/NotificationContext";

export default function useNotification(): {
    notification?: INotification,
    setNotification: (notification: INotification) => void,
} {

    const context = useContext(NotificationContext)

    if(!context) {
        throw new Error('The useNotification hook must be inside an NotificationContext Provider!')
    }

    const setNotification = useCallback((notification: INotification) => {
        context.setNotification(notification)
    }, [context])

    return {
        notification: context.notification,
        setNotification
    }
}