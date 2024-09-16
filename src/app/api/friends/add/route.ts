import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { addFriendvalidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import zod from 'zod'

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const { email: emailToAddd } = addFriendvalidator.parse(body.email);


        // this is giving chaching problem so we going to use redisfetch helper function that we made for validation

        // const RESTResponse = await fetch(
        //     `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAddd}`,  // validating/finding whethre that needs to be added as friend exist or not in our database(i.e has a account or not)
        //     {
        //         headers: {
        //             Authorization : `Bearer ${ process.env.UPSTASH_REDIS_REST_TOKEN}`,
        //         },
        //         cache: 'no-store'
        //     }
        // )
        // const data = await RESTResponse.json() as {result: string | null} // we get a { result: value } as the Response
        // const idToAdd = data.result

        const idToAdd = await fetchRedis('get', `user:email:${emailToAddd}`) as string

        if(!idToAdd) {
            return new Response("Person does not exist", { status: 400 })
        }

        const session = await getServerSession(authOptions)

        if(!session) {
            return new Response("Unauthorized", { status: 401 })
        }

        if(idToAdd === session.user.id){    
            return new Response("You cannot add youself as friend", { status: 400 })
        }

        const isAlreadyAdded = (await fetchRedis('sismember',   //checking session.user.id(current user) exist in other user's friend requst list(idToAdd) or not
            `user:${idToAdd}:incoming_friend_requests`,         // sismember ---> setismember
            session.user.id)) as 0 | 1

        if(isAlreadyAdded) {
            return new Response("Person already added", { status: 400 })
        }

        const isAlreadyFriends = (await fetchRedis('sismember',   // checking the person is already a friend
            `user:${session.user.id}:friends`,                    // above and this logic both is correct is if one is the friend of other then other is also the friend of that one person
            idToAdd)) as 0 | 1

        if(isAlreadyFriends) {
            return new Response("Person already is your friend", { status: 400 })
        }

        // after validation, adding current user to friend requst list
        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        return new Response('OK')

        // console.log(data)
    }   catch(error) {

        if (error instanceof zod.ZodError){
            return new Response("Invalid request payload", { status: 422 })
        }

        return new Response("Invalid Request", { status: 400 })
    }
}