'use client'
import Link from "next/link";
import { User } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";


interface FriendRequestSiderBarOptionProps {
    initialUnseenRequestCount: number
    sessionId: string
}

const FriendRequestSiderBarOption: FC<FriendRequestSiderBarOptionProps> = ({
    initialUnseenRequestCount,
    sessionId
}) => {

    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
        initialUnseenRequestCount
    )

    // console.log(unseenRequestCount)

    
    // adding realtime count

    useEffect(() => {
        // listning to this requestf
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))   
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const friendRequestHandler = () => {
            setUnseenRequestCount((prev) => prev + 1)
        }
        const addedFriendHandler = () => {
            setUnseenRequestCount((prev) => prev - 1)
        }

        // whenever this happens invoke the mentioned funciton 
        pusherClient.bind('incoming_friend_requests', friendRequestHandler)    
        pusherClient.bind('new_friend', addedFriendHandler)                             

        // happens on unmount
        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler)                                       // whenever this happens invoke the mentioned funciton 
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
            pusherClient.unbind('new_friend', addedFriendHandler)                             

        }
    }, [sessionId]) 

    return <>
        <Link href='/dashboard/requests' className="text-[--text-primary] hover:bg-gray-200 dark:hover:bg-black group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
            <div className="text-[--text-primary] dark:text-[--text-primary] flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-[--bg-secondary] dark:group-hover:bg-black group-hover:bg-gray-200">
                <User className="h-4 w-4" />
            </div>
            <p className="truncate">
                Friend Requests
            </p>

            {
                unseenRequestCount > 0 ? (
                    <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
                        {unseenRequestCount }
                    </div>
                ) : null
            }
        </Link>
    </>
}
export default FriendRequestSiderBarOption;