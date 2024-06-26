'use client'

import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@nextui-org/react";
import {useEffect, useRef, useState} from "react";
import {Subscription, take, timer} from "rxjs";
import useNotification from "@/app/ui/hooks/useNotification";
import {NotificationType} from "@/app/ui/context/NotificationContext";

export default function Toast() {

    const { notification } = useNotification();
    const subRef = useRef<Subscription>();

    const [
        show,
        setShow
    ] = useState<boolean>(false)

    useEffect(() => {
        if(notification) {
            setShow(true)
        }

        subRef.current = timer(10_000).pipe(
            take(1)
        ).subscribe(() => {
            setShow(false)
        })

        return () => {
            subRef.current?.unsubscribe()
        }

    }, [notification]);

    function delegateBackground() {
        switch (notification?.type) {
            case NotificationType.INFO: return "bg-blue-100"
            case NotificationType.ERROR: return "bg-red-200"
            case NotificationType.SUCCESS: return "bg-green-200"
            case NotificationType.WARNING: return "bg-yellow-200"
            default: return ""
        }
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="toast"
                    initial={{x: 100, y: 0, opacity: 0}}
                    animate={{x: 0, y: 0, opacity: 1}}
                    exit={{x: 100, opacity: 0}}
                    className="fixed right-0 sm:right-10 top-[10%] sm:max-w-[400px] w-full z-10"
                >
                    <Card className={ delegateBackground() }>
                        <CardHeader className="justify-between mb-0 pb-0">
                            <h4
                                className="text-small font-semibold leading-none text-default-600"
                            >
                                { notification?.type }
                            </h4>
                            <Button
                                isIconOnly
                                size='sm'
                                className="bg-transparent hover:bg-gray-400 hover:text-red-600"
                                onClick={() => setShow(false)}
                            >
                                X
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <p>{ notification?.message }</p>
                        </CardBody>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )

}