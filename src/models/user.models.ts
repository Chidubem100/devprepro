import {Schema, Types, Model, model} from 'mongoose';
import bcrypt from 'bcrypt';
import { ExpressValidator, checkSchema } from 'express-validator';
import validator from 'validator'
import { transpileModule } from 'typescript';

interface User {
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
        validate: {
            validator : validator.isemail,
            message: 'Please provide a valid email'
        }
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
        minlength: [7,"Password should not be less than 7 characters"]
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

const UserModel = model('User', userSchema);
export default UserModel;