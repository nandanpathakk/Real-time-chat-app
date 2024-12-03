import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession, User } from "next-auth";
import { notFound } from "next/navigation";
import FriendRequest from "@/components/FriendRequest";


const page = async () => {

    const session = await getServerSession(authOptions);

    // console.log(session)

    if (!session) {
        notFound()
    }
    // console.log("this is session id:", session.user.id)

    const incomingSenderIds = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)) as string[]  // as string[] ---> because we are getting back a bunch of user ids 


    // extracting emails from the id's
    const incomingFriendRequests = await Promise.all(    // promeise.all ---> lets you await array of promises simultaneously. so each friend request will be fetched at the same time and no one after another improiving performance
        incomingSenderIds.map(async (senderId) => {
            const sender = (await fetchRedis('get', `user:${senderId}`)) as string

            const senderParsed = JSON.parse(sender) as User  // was not showing the email so need to pass it to JSON.parse as User

            return {
                senderId,
                senderEmail: senderParsed.email,
                senderName: senderParsed.name
            }

        })
    ) 

    return <main className="pt-8 px-10">
        <h1 className="font-bold text-5xl mb-8 text-[--text-primary] poppins-bold">Friend requests</h1>
        <div className="flex flex-col gap-4">
            <FriendRequest incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
        </div>
    </main>



}
export default page;