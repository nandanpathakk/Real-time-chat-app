'use client'
import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface SideBarChatListProps {
    friends: User[],
    session: string
}

const   SideBarChatList: FC<SideBarChatListProps> = ({ friends, session }) => {

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const router = useRouter()
    const pathname = usePathname()

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
            friends.sort().map((friend) => {
                const unSeenMessageCount = unseenMessages.filter((unSeenMsg) => {
                    return unSeenMsg.senderId === friend.id
                }).length

                return <li key={friend.id}>
                    <a  href={`/dashboard/chat/${chatHrefConstructor(
                        session,
                        friend.id
                    )}`}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                        {friend.name}{
                            unSeenMessageCount > 0 ? (
                                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
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