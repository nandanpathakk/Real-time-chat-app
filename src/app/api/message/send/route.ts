import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {Message, messageValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import {nanoid} from 'nanoid'
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {

    try {
        const {text, chatId}:{text: string, chatId: string} = await req.json();

        const session = await getServerSession(authOptions);

        if(!session) return new Response("Unauthorized", { status: 401});

        const [userId1, userId2] = chatId.split('--')

        if(session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response('Unauthorized', { status: 401 })
        }

        const chatPartner = session.user.id === userId1 ? userId2 : userId1

        const friendList = (await fetchRedis('smembers', `user:${session.user.id}:friends`)) as string[]
        const isFriend = friendList.includes(chatPartner)

        if(!isFriend) {
            return new Response("Unauthorized", { status: 401 })
        }

        const rawSender = ( await fetchRedis(
            'get',
            `user:${session.user.id}`
        )) as string

        const sender = JSON.parse(rawSender) as User
        const timeStamp = Date.now()

        const messaageData: Message ={ 
            id: nanoid(),
            senderId: session.user.id,
            text,
            timeStamp,
        }

        const message = messageValidator.parse(messaageData)


        // making realtime

        pusherServer.trigger(toPusherKey(`chat:${chatId}`),
        'incoming-message',
        message
    )

    pusherServer.trigger(toPusherKey(`user:${chatPartner}:chats`), "new_message", {
        ...message, 
        senderImg: sender.image,
        senderName: sender.name
    })

        // sending message
        await db.zadd(`chat:${chatId}:messages`, {
            score: timeStamp,
            member: JSON.stringify(message)
        })

        return new Response('OK')

    } catch (error) {
        if(error instanceof Error) {
            return new Response(error.message, { status: 500})
        }

        return new Response("Internal server error", { status:500 })
    }

}