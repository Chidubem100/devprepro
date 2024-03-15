import mongoose from "mongoose";
import QuestionSchema from "./question.schema";
import { z } from "zod";


type Question = z.infer<typeof QuestionSchema>;


const questionSchema = new mongoose.Schema<Question>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type:String,
        required: true,
        trim: true,
    },
    isPromoted: {
        type: Boolean,
        required: true,
        default: false
    },
    category: {
        type: String,
        required: true,
        trim: true,
        default: "Frontend",
        enum: [
            "Frontend",
            "Backend",
            "Cyber security",
            "Devops",
            "Developer Relationship",   
            "Cyber engineering",
            "Product management",
            "Web design",
            "System design"
        ]
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    upvote: {
        type: Number,
        default: 0
    }
},{timestamps:true});

const Question = mongoose.model("Question", questionSchema);
export default Question;