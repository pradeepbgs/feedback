import {z} from 'zod';

export const messageSchema = z.object({
    content: z.string()
    .min(10,{message:"minimum 10 characters needed"})
    .max(300,{message:"content must be no longer than 300 characters"})
})