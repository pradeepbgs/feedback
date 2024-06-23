import { Message } from "@/models/user.model"

export interface apiResponse {
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<Message>
}