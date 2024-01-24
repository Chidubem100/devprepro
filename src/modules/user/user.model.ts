import mongoose from "mongoose";
import { userSchema } from "./user.schema";
import { z } from "zod";

type UserSchemaType = z.infer<typeof userSchema>;

const userMongooseSchema = new mongoose.Schema<UserSchemaType>({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type:String,
        required: true,
    }
})






export const UserModel = mongoose.model<UserSchemaType & mongoose.Document>('User', userMongooseSchema);