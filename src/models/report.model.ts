import mongoose,{ Schema,Types,model,ObjectId } from "mongoose";
import UserModel,{User} from "./user.models";
import AnswerModel, {Answer} from "./answer.model";

interface Report{
    readonly _id: Types.ObjectId,
    user: User['_id'],
    answer: Answer['_id'],
    content: string,
    date: Date,
    resolved: boolean
}

const reportSchema = new Schema<Report>({
    user: {
        // type: mongoose.Types.ObjectId,
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answer:{
        type: Schema.Types.ObjectId,
        ref: 'Answer',
        required: true
    },
    content: {
        type: String,
        trim: true,
        minlength: [2, 'Report should not be less than 2 characters'],
        required: true
    },
    date:{
        type: Date,
        default: new Date,
        required: true
    },
    resolved: {
        type: Boolean,
        default: false,
        required: true,
    }
});

const ReportModel = model('Report', reportSchema);
export default ReportModel;
