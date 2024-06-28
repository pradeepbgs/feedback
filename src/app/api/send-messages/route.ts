import dbConnection from "@/lib/dbConnect";
import { UserModel,MessageModel, Message} from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    await dbConnection();

    const {username,message} = await request.json();
    console.log(username,message);

    if(!message || !username){
        return NextResponse.json(
            {
                success: false,
                message: "Message or username is required"
            },
            { status: 400 }
        );
    }

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessages){
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                { status: 404 }
            );
        }

        const newMessage = {content:message, createdAt:new Date()}

         user.messages.push(newMessage as Message);
         await user.save();

         return NextResponse.json(
            {
                success: true,
                message: "Message sent"
            },
            { status: 200 }
        );

    } catch (error:any) {
        console.log(`error while sending message , ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                message: "error while sending message"
            },
            { status: 500 }
        );
    }
}