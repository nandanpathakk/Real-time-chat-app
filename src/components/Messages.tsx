'use client'
import { Message } from "@/lib/validations/message";
import { FC, useEffect, useRef, useState } from "react";
import { cn, toPusherKey } from "@/lib/utils";   
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";





interface MessagesProps {
    initialMessages: Message[]
    sessionId: string
    sessionImg: string | null | undefined
    chatPartner: User
    chatId: string
}

const Messages: FC<MessagesProps> = ({
    initialMessages,
    sessionId,
    sessionImg,
    chatPartner,
    chatId
}) => {

    const [finalMessages, setFinalMessages] = useState<Message[]>(initialMessages)


    useEffect(() => {
        // listning to this requestf
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))   

        const MessageHandler = (message: Message) => {
            
            setFinalMessages((prev) => [message, ...prev])
        }

        // whenever this happens invoke the mentioned funciton 
        pusherClient.bind('incoming-message', MessageHandler)                                 

        // happens on unmount
        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
            pusherClient.unbind('incoming-message', MessageHandler)                                       // whenever this happens invoke the mentioned funciton 

        }
    }, [chatId])

    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTimestamp =(timeStamp: number) => {
        return format(timeStamp, "HH:mm")
    }

    return <div id="messages" className="flex h-full flex-1 flex-col-reverse gap-4 p-3 px-10 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <div ref={scrollDownRef} />
        {
            finalMessages.map((message, index) => {
                const isCurrentUser = message.senderId === sessionId
                const hasNextMessageFromSameUser = finalMessages[index - 1]?.senderId === finalMessages[index].senderId  // to check the previous message was from the same user or not to syle it accordingly

                return <div key={`${message.id}-${message.timeStamp}`} className="'chat-message poppins-regular">

                    <div className={cn('flex items-end', {
                        'justify-end': isCurrentUser
                    })}>
                        <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                            'order-1 items-end': isCurrentUser,
                            'order-2 items-start': !isCurrentUser
                        })}>

                            <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                'bg-indigo-600 text-white': isCurrentUser,
                                'bg-[--bg-friend-message] text-[--text-friend-message]': !isCurrentUser,
                                'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser 
                            })}>
                                {message.text }{' '}
                                <span className="ml-2 text-xs text-gray-400">
                                    {
                                        formatTimestamp(message.timeStamp)
                                    }
                                </span>
                            </span>
                        </div>
                        <div className={cn('relative w-6 h-6', {
                            'order-2': isCurrentUser,
                            'order-1': !isCurrentUser,
                            'invisible': hasNextMessageFromSameUser
                        })}>
                            <Image 
                            fill
                            src = {isCurrentUser ? (sessionImg as string) : chatPartner.image}
                            alt="Profile Picture"
                            referrerPolicy="no-referrer"
                            className="rounded-full"
                            />
                        </div>
                    </div>
                </div>
            })
        }
    </div>
}
export default Messages;