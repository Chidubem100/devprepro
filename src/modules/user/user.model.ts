import mongoose from "mongoose";
// import User from "./user.schema";
import UserSchema from "./user.schema";
import bcrypt from "bcrypt";
import { z } from "zod";

type User = z.infer<typeof UserSchema>;
// interface User extends Document, User{}

const userMongooseSchema = new mongoose.Schema<User>({
   
    username: {
        type:String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type:String,
        required: true,
        trim: true,
    },
    password: {
        type:String,
        required: true,
        minlength: [8, "Password should not be less than 8 characters!!"]
    },
    bio:{
        type: String,
        trim: true
    },
    role:{
        type: String,
        default: "user"
    },
    active: {
        type: Boolean,
        default: true
    },
    emailVerificationToken: String,
    isEmailVerified: {
        type:Boolean, 
        default:false
    },
    verificationRequest: {
        type:String,
        default: "default",
        enum: [
            "default",
            "pending",
            "approved"
        ]
    },
    isVerified:{
        type:Boolean, 
        default:false
    },
    isVerifiedDate: Date,
    passwordToken: String,
    passwordTokenExpiration: Date,
    preferences: [
        String
    ],
    colorMode: {
        type: String,
        default: "dark",
        enum: [
            "light", 
            "dark"
        ]
    },
    themes: {
        type:String,
        default: "default",
        enum: [
            "default",
            "custom"
        ]
    }
},{timestamps:true});

userMongooseSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userMongooseSchema.methods.comparePassword = async function(userPassword:string){
    return await bcrypt.compare(userPassword, this.password)
};


const User = mongoose.model("User", userMongooseSchema);
export default User;
