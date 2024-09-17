import zod, { string } from 'zod';

export const messageValidator = zod.object({
    id: zod.string(),
    senderId: zod.string(),
    text: zod.string(),
    timeStamp: zod.number(),
})

export const maessageArrayValidator = zod.array(messageValidator);

export type Message = zod.infer<typeof messageValidator>   // similar message in types but with proper validation