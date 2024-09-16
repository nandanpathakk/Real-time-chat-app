'use client'

import { FC, useState } from "react"
import { UserPlus, Check, X } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequest: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {

    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)
    const router = useRouter()

    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', {
            id: senderId,
        })

        setFriendRequests((previousRequest) => 
            previousRequest.filter((request) => request.senderId !== senderId )
        )

        router.refresh()
        
    }

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', {
            id: senderId,
        })

        setFriendRequests((previousRequest) => 
            previousRequest.filter((request) => request.senderId !== senderId )
        )

        router.refresh()
        
    }

    return <div>
        {
            friendRequests.length === 0 ? (
                <p className="text-sm text-zinc-500">Nothing to show here</p>
            ) : (
                friendRequests.map((request) => (
                    <div key={request.senderId} className="flex gap-4 items-center">
                        <UserPlus className="text-black" />
                        <p className="font-medium text-lg">{request.senderEmail}</p>
                        <button 
                        onClick={() => acceptFriend(request.senderId)}
                        aria-label="accept friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-sm">
                            <Check className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                        <button
                        onClick={() =>  denyFriend(request.senderId)}
                        aria-label="deny friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-sm">
                            <X className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                        
                    </div>
                ))
        )}
    </div>
}
export default FriendRequest;