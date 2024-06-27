import dbConnection from "@/lib/dbConnect";
import {UserModel} from '@/models/user.model'
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest){
    await dbConnection()
    try {
        const {username,email,password} = await request.json()
        const existingUserVerifiedUsername = await UserModel.findOne(
            {
                username,
                isVerified:true
            }
        )

        if (existingUserVerifiedUsername){
            return NextResponse.json({
                success:false,
                message:"username already exists"
            },{status:400}
            )
        }

        const existingUserByEmail = await UserModel.findOne( {email} )

        const verifyCodeOTP = Math.floor(100000 + Math.random() *900000).toString()

        if (existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success:false,
                    message:"user already exists with email"
                },{status:400})
            } else {
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCodeOTP
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); 
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCodeExpiry: new Date(Date.now() + 5 * 60 * 1000), 
                verifyCode:verifyCodeOTP, 
                isVerified:false, 
                isAcceptingMessages:true,
                messages:[]
            })

            await newUser.save()
        }

        // send verification email 

       const emailResponse =  await sendVerificationEmail(
            email,
            username,
            verifyCodeOTP
        )

        if(!emailResponse.success){
            return NextResponse.json({message:emailResponse.message},{status:400})
        }

        return NextResponse.json({message:"user registered successfully"},{status:200})

    } catch (error:any) {
        console.log('error while signingup',error?.message);
        return NextResponse.json({
            success:false,
            message:"error while signing up , "+error.message
        },{status:400})
    }
}