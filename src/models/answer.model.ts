import {Schema, Types, model, Document} from 'mongoose';
import validator from 'validator';
import { User } from './user.models';
import { Question } from './question.model';

export interface Answer extends Document{
    readonly _id: Types.ObjectId,
    user: User['_id'],
    question: Question['_id'],
    verified: boolean,
    flagDown: number,
    content: string,
    picture: string
}

const answerSchema = new Schema<Answer>({
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
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    flagDown: {
        type: Number
    },
    content: {
        type: String,
        required: true,
        minlength: [2,'Answer should not be less than 2 characters'],
        trim: true
    },
    picture: { 
        type: String
    }
},{timestamps: true});



const AnswerModel = model<Answer>('Answer', answerSchema);
export default AnswerModel;