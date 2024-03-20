import Comment from "./comment.model";


// create comment
export async function createCommentService(val:any){
    const comment =  await Comment.create({
        username: val.username,
        user: val.user,
        commentBody: val.commentBody,
        answer: val.answer
    });
    return comment;
}

// find comment
export async function findCommentById(val:string){
    const comment = await Comment.findById({_id:val});
    return comment;
} 

// get single comment
export async function getSingleCommentService(val:string){
    const comment = await Comment.findById({_id:val}).populate({
        path: 'user',
        select: 'username'
    }).populate({
        path: 'replies'
    });
    return comment;
}

// all comments for an answer
export async function getAllCommentService(val:string){
    const comment = await Comment.find({answer:val})
    return comment;
}