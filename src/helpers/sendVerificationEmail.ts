import { resend } from "@/lib/resend";
import verificationEmail from '../../emails/verificationemail'
import { apiResponse } from "@/types/apiResponse";
import { NextRequest } from "next/server";
import VerificationEmail from "../../emails/verificationemail";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifycode:string
):Promise<apiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'verification code',
            react: VerificationEmail({username, otp:verifycode}),
          });

        return {
            success:true,
            message:"verification email send successfully"
        }
    } catch (error:any) {
        console.error(error.message && "error sending verification email")
        return {
            success:false,
            message:"failed to send verification email"
        }
    }
}