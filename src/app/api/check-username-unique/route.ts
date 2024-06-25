import { UserModel } from "@/models/user.model";
import dbConnection from "@/lib/dbConnect";
import {z} from 'zod'
import { usernameValidation } from "@/schema/signupSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:NextRequest){

    await dbConnection();
    try {

        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        const result =  UsernameQuerySchema.safeParse(queryParam);
        console.log(result)
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return NextResponse.json(
                {
                    success:false,
                    message:usernameError.length > 0 ? usernameError.join(',') :
                     'Invalid query parameters'
                },
                {status:400}
            )
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            verified:true
        })

        if (existingVerifiedUser){
            return NextResponse.json(
                {
                    success:false,
                    message:"Username is taken"
                },
                {
                    status:400
                }
            )
        }

        return NextResponse.json(
            {
                success:true,
                message:"Username is available"
            },
            {
                status:200
            }
        )

    } catch (error:any) {
        console.log(error,"error while checking username")
        return NextResponse.json(
            {
                success:false,
                message:error.message + "error while checking username"
            },
            {status:500}
        )
    }
}