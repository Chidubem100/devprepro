import Answer from "./answer.model";


// create answer
export async function createAnswerService(val:any){
    const answer = await Answer.create({
        username: val.username,
        user: val.user,
        body: val.body,
        question: val.question
    });
    return answer;
}

// find answer
export async function findAnswerById(val:string){
    const answer = await Answer.findById({_id:val});
    return answer;
} 

// get single answer
export async function getSingleAnswerService(val:string){
    const answer = await Answer.findById({_id:val}).populate({
        path: 'user',
        select: 'username'
    }).populate({
        path: 'comments'
    });
    return answer;
}

// all answers for a question
export async function getAllAnswerService(val:string){
    const answer = await Answer.find({question:val})
    return answer;
}