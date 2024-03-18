import Question from "./question.model";

export async function createQuestions(val:any){
    const question = await Question.create({
        username: val.username,
        category: val.category,
        body: val.body,
        user: val.user
    });
    return question;
};

export async function findQuestions(val:string){
    const question = await Question.find({val})
    return question;
}

export async function findQuestionById(val:string, userId:string){
    const question = await Question.findById({_id:val,user:userId})
    return question;
};

export async function findOneQuestion(val:string){
    const question = await Question.findOne({_id:val})
    return question;
}

export async function findByIdAndUpdate(postId:string,userId:string, body:{body:string, category:string}){
    const question = await Question.findByIdAndUpdate({_id:postId,usefr:userId },body,{
        runValidators: true,
        new: true
    });
    return question;
}