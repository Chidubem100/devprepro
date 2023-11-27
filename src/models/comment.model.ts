import {Schema, Types, model, Document} from 'mongoose';
import validator from 'validator';
import { User } from './user.models';
import { Question } from './question.model';

export interface Comment extends Document{
    readonly _id: Types.ObjectId;
    user: User['_id'];
    question: Question['_id'];
    verified: boolean;
    flagDown: number;
    content: string;
    picture: string;
    replies: Replies['_id'][];
}

export interface Replies extends Document{
    readonly _id: Types.ObjectId;
    user: User['_id'];
    comment: Comment['_id'];
    content: string;
    picx: string;
}

const repliesSchema = new Schema<Replies>({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Comment cannot be empty']
    },
    picx: {
        type: String,
    }
});


const commentSchema = new Schema<Comment>({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: [2,'Answer should not be less than 2 characters'],
        trim: true
    },
    picture: { 
        type: String
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Replies'
        }
    ]
},{timestamps: true});



const CommentModel = model<Comment>('Comment', commentSchema);
const RepliesModel = model<Replies>('Replies', repliesSchema);

export {CommentModel, RepliesModel};