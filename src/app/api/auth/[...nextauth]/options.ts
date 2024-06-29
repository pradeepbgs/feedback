import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnection from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";


export const AuthOptions:NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                email: {label:"Email",type:"text"},
                password: {label:"password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnection()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier},

                        ]
                    })

                    if (!user) throw new Error("No user found with credential")

                     if (!user.isVerified) throw new Error("Please verify your account first")  

                    const decodedPassword = await bcrypt
                    .compare(String(credentials.password),String(user.password))

                    if (decodedPassword){
                        return user
                    } else {
                        throw new Error("Invalid password")
                    }

                } catch (error:any) {
                    throw new Error(error) 
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if (user) {
                token._id = user._id?.toString(),
                token.isVerified = user.isVerified,
                token.isAcceptingMessages=user.isAcceptingMessages,
                token.username = user.username
            }
            return token
        },
        async session({session,token}){
            if (token) {
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages=token.isAcceptingMessages,
                session.user.username = token.username
            }
            return session
        }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
}