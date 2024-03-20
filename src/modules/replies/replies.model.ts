import mongoose from "mongoose";
import {z} from "zod";
import RepliesSchema from "./replies.schema";

type Replies = z.infer<typeof RepliesSchema>;

const replySchema = new mongoose.Schema<Replies>({
    username: {
        type:String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
    replyBody: {
        type: String,
        required:true,
        trim: true
    }
}, {
    timestamps:true,
    toJSON: {virtuals:true}, 
    toObject: {virtuals:true}
});

const Replies = mongoose.model("Replies", replySchema);
export default Replies;