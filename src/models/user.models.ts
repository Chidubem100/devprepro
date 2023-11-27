import {Schema, Types, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

export interface User extends Document {
   readonly _id: Types.ObjectId,
   email: string,
   username: string,
   password: string,
   avatar: string,
   role: string,
   isVerified: boolean,
   isVerifiedDate: Date,
   passwordResetToken: string,
   passwordTokenExpiration: Date, 
   deviceType: string,
}


const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
        validator : validator.isEmail,
        message: 'Please provide a valid email'
    },
    username: {
        type:String,
        required: true,
        trim:true,
        minlength: [1, "Username should not be less than 1 character"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8,"Password should not be less than 7 characters"]
    },
    avatar: {
        type: String,
        trim: true
    },
    role:{
        type: String,
        required: true,
        default: "user",
        enum: [
            "user",
            "moderator"
        ]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isVerifiedDate: {
        type:Date
    },
    passwordResetToken: {
        type: String
    },
    passwordTokenExpiration: {
        type: Date
    },
    deviceType:{
        type: String,
        required: true,
        trim: true
    }
});





const UserModel = model<User>('User', userSchema);
export default UserModel;