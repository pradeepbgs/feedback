import { getServerSession } from "next-auth";
import dbConnection from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest) {
    // const { message_id } = await request.json()
    const message_id = request.nextUrl.searchParams.get('message_id');
      console.log(message_id)

    if (!message_id) {
        return NextResponse.json(
            {
                success: false,
                message: "Message ID is required"
            },
            { status: 400 }
        );
    }

    await dbConnection();
    const session = await getServerSession(AuthOptions)
    const user: User = session?.user as User

    if (!session || !session?.user) {
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
        const updatedResult = await UserModel.updateOne(
            { _id: user_id },
            { $pull: { messages: { _id: message_id } } }
        )
        console.log(updatedResult)
        if (updatedResult.modifiedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "message not found or already deleted"
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json(
            {
                success: false,
                message: error.message ?? "failed to delete message"
            },
            { status: 500 }
        );
    }
}