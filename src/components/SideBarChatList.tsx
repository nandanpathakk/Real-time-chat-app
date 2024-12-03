'use client'
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import Image from "next/image";

interface SideBarChatListProps {
    friends: User[],
    sessionId: string
}

interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string
}

const   SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const [activeChats, setActiveChats] = useState<User[]>(friends)
    const router = useRouter()
    const pathname = usePathname()


    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const newFriendHandler = (newFriend: User) => {
            setActiveChats((prev) => [...prev, newFriend])
        }

        const chatHandler = (message: ExtendedMessage ) => {
            const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

            if(!shouldNotify) return

            toast.custom((t) => (
                <UnseenChatToast 
                t={t}
                sessionId={sessionId}
                senderId={message.senderId}
                senderImg={message.senderImg}
                senderName={message.senderName}
                senderMessage={message.text}
                />
            ))

            setUnseenMessages((prev) => [...prev, message])
        }

        pusherClient.bind("new_message", chatHandler)
        pusherClient.bind("new_friend", newFriendHandler)

        return() => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

            pusherClient.unbind("new_message", chatHandler)
            pusherClient.unbind("new_friend", newFriendHandler)
        }
    },[pathname, sessionId, router])

    //to filter the seen messages
    useEffect(() => {
        if (pathname?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId))   // if pathname includes word 'chat' meaning the user is in a chat and have seen the message of that particular chat
            })                                                                  // so we will filter out those message from the state which has a particular senderId from the list of all unseen message in the from the database
        }
    }, [pathname])

    return <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
        {
            activeChats.sort().map((friend) => {
                const unSeenMessageCount = unseenMessages.filter((unSeenMsg) => {
                    return unSeenMsg.senderId === friend.id
                }).length

                return <li key={friend.id}>
                    <a  href={`/dashboard/chat/${chatHrefConstructor(
                        sessionId,
                        friend.id
                    )}`}
                    className="text-gray-700 dark:text-[--text-primary] dark:hover:bg-black hover:bg-gray-100 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 poppins-semibold tracking-wide">
                        {/* {friend.image} */}
                        <div className="relative w-6 sm:w-8 h-6 sm:h-8">
                        <Image 
                        src = {friend.image}
                        alt="display image"
                        referrerPolicy ="no-referrer"
                        fill
                        className="rounded-full"
                        />
                        </div>
                        {friend.name}{
                            unSeenMessageCount > 0 ? (
                                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center poppins-regular">
                                    {unSeenMessageCount}
                                </div>
                            ) : null
                        }
                        </a>                                   {/* a forces hard reload and LINK doesnot*/}
                </li>
            })
        }   
    </ul>
}
export default SideBarChatList;