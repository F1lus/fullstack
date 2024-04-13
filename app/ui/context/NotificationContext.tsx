import {createContext, Dispatch, SetStateAction} from "react";

export enum NotificationType {
    INFO = "Information",
    SUCCESS = "Success",
    ERROR = "Error",
    WARNING = "Warning"
}

export interface INotification {
    type: NotificationType
    message: string
}

type NotificationHandler = {
    notification?: INotification,
    setNotification: Dispatch<SetStateAction<INotification | undefined>>
}

export const NotificationContext = createContext<NotificationHandler>({
    setNotification: () => {}
})