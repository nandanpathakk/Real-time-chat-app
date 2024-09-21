import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import zod  from 'zod'

export async function POST(req: Request) {

    try {
        const body = await req.json()

        const { id: idToAccept } = zod.object({ id: zod.string() }).parse(body)  // parse is successfull then we will get an idToAccept as string

        const session = await getServerSession(authOptions);

        if(!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        const isAlreadyFriends = await fetchRedis(
            'sismember',
            `user:${session.user.id}:friends`,
        idToAccept)

        if(isAlreadyFriends) {
            return new Response('Already Friends', { status: 400})
        }

        const hasFriendRequest = await fetchRedis(
            'sismember',
            `user:${session.user.id}:incoming_friend_requests`,
            idToAccept
        )

        // console.log('hasfriendrequest', hasFriendRequest)

          if(!hasFriendRequest) {
            return new Response ("No friend Request", { status: 400})
        }

        const [userRaw, friendRaw] = (await Promise.all([
            fetchRedis('get', `user:${session.user.id}`),
            fetchRedis('get', `user:${idToAccept}`)
        ])) as [string, string]

        const user = JSON.parse(userRaw) as User
        const friend = JSON.parse(friendRaw) as User


        await Promise.all([
            pusherServer.trigger(toPusherKey(`user:${idToAccept}:friends`), 'new_friend', user),
            pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), 'new_friend', friend),
            db.sadd(`user:${session.user.id}:friends`, idToAccept),
            db.sadd(`user:${idToAccept}:friends`, session.user.id),  // to as friend to both the person's friends list
            db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAccept)  // removing from friend request list

            // db.srem(`user:${idToAccept}:outbound_friend_requests`, session.user.id)   // can apply this feature of showing outbounded/outgoing request later

        ])

        return new Response('OK')
      
    } catch(error) {
        
        if(error instanceof zod.ZodError) {
            return new Response("Invalid Request payload", { status: 422    })
        }

        return new Response("Some unknown error occured", {status: 400})
    }
}