import {Schema, Types, model, Document} from 'mongoose';
import validator from 'validator';
import { User } from './user.models';
import { Answer } from './answer.model';
import { Comment } from './comment.model';

export interface Question extends Document{
    readonly _id: Types.ObjectId;
    user: User['_id'];
    category: string;
    content: string;
    picx: string;
    answers: Answer['_id'][];
    comments: Comment['_id'][];
}


const questionSchema = new Schema<Question>({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type:String,
        enum: ['FrontEnd', 'Backend', 'Cybersecurity', 'Devops', 'Product designer', 'Developer advocate']
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    picx:{
        type: String,
    },
    answers: [
        {   
            type: Schema.Types.ObjectId,
            ref: 'Answer',
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

},{timestamps:true});

const QuestionModel = model<Question>('Question', questionSchema);
export default QuestionModel;