import { getServerSession } from "next-auth";
import dbConnection from "@/lib/dbConnect";
import { UserModel} from "@/models/user.model";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request:NextRequest) {
    await dbConnection();
    const session = await getServerSession(AuthOptions)
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

    const user_id = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: {id:user_id} },
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "user not found"
                 },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                messages:user[0].messages
             },
            { status: 200 }
        );
    } catch (error:any) {
        console.log(error.message);

        return NextResponse.json(
            {
                success: false,
                message: "failed to get messages"
             },
            { status: 500 }
        );
    }
}