import mongoose from "mongoose";
import CommentSchema from "./comment.schema";
import {z} from "zod";


type Comment = z.infer<typeof CommentSchema>;

const commentSchema = new mongoose.Schema<Comment>({
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
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
        required: true
    },
    commentBody: {
        type: String,
        required:true,
        trim: true
    }
}, {
    timestamps:true,
    toJSON: {virtuals:true}, 
    toObject: {virtuals:true}
});

commentSchema.virtual('replies', {
    ref: 'Replies',
    justOne: false,
    foreignField: 'comment',
    localField: '_id'
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;