// helper function for redis database to avoid the caching behavior in nextjs

const upstatshRedishRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisAuthToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[]) {

    const commandUrl = `${upstatshRedishRestUrl}/${command}/${args.join('/')}`  // format to make request to upstatsh restapi

    const response = await fetch(commandUrl,
        {
            headers: {
                Authorization: `Bearer ${upstashRedisAuthToken}`,
            },
            cache: 'no-store'
        })

    if (!response.ok) {
        throw new Error(`Error executing Redis command: ${response.statusText}`)
    }

    const data = await response.json()

    return data.result
}