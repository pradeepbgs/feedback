import {z} from 'zod';

export const usernameValidation = z.string()
        .min(3,"username must be atleast 3 charachters long")
        .max(20, "usernme must be atleast no longer than 20 characters");


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"invalid email address"}),
    password: z.string().min(6, {message:"password must be atleast 6 characters long"})
})