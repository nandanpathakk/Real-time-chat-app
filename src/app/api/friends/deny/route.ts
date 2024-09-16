import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import zod, { string } from 'zod'
import { db } from "@/lib/db"

export async function  POST(req: Request) {
    try {

        const body = await req.json()
        const { id: idToDeny } = zod.object({ id: string() }).parse(body);

        const session = await getServerSession(authOptions);

        if(!session) {
            return new Response("Unauthorized", { status: 401 })
        }

        await  db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

        return new Response("OK")

    } catch (error) {
        
        if(error instanceof zod.ZodError){
            return new Response("Invalid request payload", { status: 422 })
        }

        return new Response("Invalid request", { status: 400 })

    }
}