import { UserModel } from "@/models/user.model";
import dbConnection from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    await dbConnection();

    try {
        const username = request.nextUrl.searchParams.get('username');
        const code = request.nextUrl.searchParams.get('code');
        console.log(code , username)
        const decodedUsername = decodeURIComponent(username!)

        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return NextResponse.json(
                { 
                    success:false,
                    message:"username not found"
                 },
                 {
                    status:500
                 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return NextResponse.json(
                {
                    success:true,
                    message:"code verified successfully"
                 },
                 {
                    status:200
                 }
            )
        } else if (!isCodeNotExpired){
            return NextResponse.json(
                { 
                    success:false,
                    message:"verifyCode is expired, pls signup again to get new code"
                 },
                 {
                    status:400
                 }
            )
        } else {
            return NextResponse.json(
                { 
                    success:false,
                    message:'incorrect verification code'
                 },
                 {
                    status:400
                 }
            )
        }

    } catch (error:any) {
        console.log("error verifying code"+error.message)
        return NextResponse.json(
            { 
                success:false,
                message:"error in verifyin code"+error.message
             },
             {
                status:500
             }
        )
    }
}