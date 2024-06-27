import { UserModel } from "@/models/user.model";
import dbConnection from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnection();

  try {
    const username = request.nextUrl.searchParams.get('username');
    const code = request.nextUrl.searchParams.get('code');

    const decodedUsername = decodeURIComponent(username!);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username not found",
        },
        {
          status: 404,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const currentTime = new Date();
    const expiryTime = new Date(user.verifyCodeExpiry);
    const isCodeNotExpired = currentTime < expiryTime;

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "Code verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verify code is expired, please sign up again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Incorrect verification code',
        },
        {
          status: 400,
        }
      );
    }

  } catch (error: any) {
    console.log("Error verifying code:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying code: " + error.message,
      },
      {
        status: 500,
      }
    );
  }
}
