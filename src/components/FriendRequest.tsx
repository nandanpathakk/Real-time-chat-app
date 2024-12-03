'use client'

import { FC, useEffect, useState } from "react"
import { UserPlus, Check, X } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequest: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {

    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)
    const router = useRouter()




    // not using this as " : " is not accepted in ths function
    // useEffect(() => {
    //     pusherClient.subscribe(
    //         `user:${sessionId}:incoming_friend_requests`             
    //     )
    // },[])



    // subscribeing to the mentioned path to make the friend request in real time

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))   // listning to this requestf

        const friendRequestHandler = ({ senderId, senderEmail}: IncomingFriendRequest) => {
            setFriendRequests((prev) => [...prev, {senderId, senderEmail}])
        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)                                       // whenever this happens invoke the mentioned funciton 


        // happens on unmount
        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler)                                       // whenever this happens invoke the mentioned funciton 

        }

    }, [sessionId])


    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', {
            id: senderId,
        })

        setFriendRequests((previousRequest) =>
            previousRequest.filter((request) => request.senderId !== senderId)
        )

        router.refresh()

    }

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', {
            id: senderId,
        })

        setFriendRequests((previousRequest) =>
            previousRequest.filter((request) => request.senderId !== senderId)
        )

        router.refresh()

    }

    return <div>
        {
            friendRequests.length === 0 ? (
                <p className="text-sm text-zinc-500 poppins-poppins-regular">No pending friend requests</p>
            ) : (
                friendRequests.map((request) => (
                    <div key={request.senderId} className="flex gap-4 items-center">
                        <UserPlus className="text-[--text-primary]" />
                        <p className="font-medium text-lg text-[--text-primary] poppins-medium">{request.senderEmail}</p>
                        <button
                            onClick={() => acceptFriend(request.senderId)}
                            aria-label="accept friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-sm">
                            <Check className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                        <button
                            onClick={() => denyFriend(request.senderId)}
                            aria-label="deny friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-sm">
                            <X className='font-semibold text-white w-3/4 h-3/4' />
                        </button>

                    </div>
                ))
            )}
    </div>
}
export default FriendRequest;