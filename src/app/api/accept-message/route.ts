import { getServerSession } from "next-auth";
import dbConnection from "@/lib/dbConnect";
import { UserModel} from "@/models/user.model";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";

export async function POST(request:NextRequest) {
    await dbConnection();
    const session = await getServerSession(AuthOptions);

    const user:User = session?.user as User

    if(!session || !session?.user){
        return NextResponse.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 403 }
        );
    }

    const user_id = user._id;
    const {acceptMessages} = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user_id,
            { isAcceptingMessages:acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "failed to update user to accept messages"
                 },
                { status: 401 }
            );
        }

            return NextResponse.json(
                {
                    success: true,
                    message: "user updated to accept messages",
                    updatedUser
                 },
                { status: 200 }
            );

    } catch (error:any) {
        console.log(error.message);

        return NextResponse.json(
            { 
                success: false,
                message: "failed to update user to accept messages"
             }, 
            { status: 500 }
        );
    }
}


export async function GET(request:NextRequest) {
    await dbConnection();
    const session = await getServerSession(AuthOptions);
    const user:User = session?.user as User
    if(!session || !session?.user){
        return NextResponse.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 403 }
        );
    }
    const user_id = user._id;
    try {
        const user = await UserModel.findById(user_id).populate("messages");
        const isAcceptingMessages = user?.isAcceptingMessages
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "failed to get user"
                 },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "user found",
                isAcceptingMessages:isAcceptingMessages,
             },
            { status: 200 }
        );

    } catch (error:any) {
        console.log(error.message);

        return NextResponse.json(
            {
                success: false,
                message: "failed to get user"
             },
            { status: 500 }
        );
    }
}