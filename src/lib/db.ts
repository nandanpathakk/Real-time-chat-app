import { Redis } from "@upstash/redis";    // used upstach for redis database

export const db = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})