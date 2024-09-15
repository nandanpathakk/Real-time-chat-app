import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"

// function to check google credentials are defined or not in our .env file
function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID as string;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

    if(!clientId || clientId.length === 0) {
        throw new Error("Missing Google_CLIENT_ID")
    }

    if(!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing CLIENT_SECRET")
    }

    return {clientId, clientSecret}
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret
        }),
    ],
    //actions taken when certain events happens like signing up
    callbacks: {
        async jwt({token, user}){
            const dbUser = ( await db.get(`user:${token.id}`)) as User | null
            
            if(!dbUser) {
                token.id = user!.id
                return token
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email:dbUser.email,
                picture: dbUser.image
            }
        },
        async session({session, token}) {
            if(token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session;
        },
        redirect() {
            return '/dashboard'
        }
    }
}