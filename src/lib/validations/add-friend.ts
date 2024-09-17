import zod from 'zod'

export const addFriendvalidator = zod.object({
    email: zod.string().email()
})
