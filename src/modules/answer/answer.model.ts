import mongoose from "mongoose";
import AnswerSchema from "./answer.schema";
import {z} from "zod";


type Answer = z.infer<typeof AnswerSchema>;

const answerSchema = new mongoose.Schema<Answer>({
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
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    flagAnswerCorrect: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    flagAnswerIncorrect: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    body: {
        type: String,
        required:true,
        trim: true
    }
}, {
    timestamps:true,
    toJSON: {virtuals:true}, 
    toObject: {virtuals:true}
});

answerSchema.virtual('comments',{
    ref: 'Comment',
    justOne: false,
    foreignField: 'answer',
    localField: '_id'
});


const Answer = mongoose.model("Answer", answerSchema);
export default Answer;