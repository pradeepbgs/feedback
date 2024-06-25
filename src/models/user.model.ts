import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document{
    content:String,
    createdAt:Date,
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface User extends Document{
    username:String,
    email:String,
    password:String,
    verifyCode:String, 
    verifyCodeExpiry:Date,
    isVerified:Boolean, 
    isAcceptingMessages:Boolean,
    messages:[Message]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,'username is required'],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        match:[/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    verifyCode:{
        type:String,
        required:[true,'Password is required']
    },
    verifyCodeExpiry:{
        type:Date,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

export const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', UserSchema);

export const MessageModel = mongoose.models.Message as mongoose.Model<Message> || mongoose.model<Message>('Message', MessageSchema);

// export default{ MessageModel,UserModel};