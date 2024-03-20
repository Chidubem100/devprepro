import Replies from "./replies.model";

// create reply
export async function createReplyService(val:any){
    const reply =  await Replies.create({
        username: val.username,
        user: val.user,
        replyBody: val.replyBody,
        comment: val.comment
    });
    return reply;
}

// find reply
export async function findReplyById(val:string){
    const reply = await Replies.findById({_id:val});
    return reply;
} 

// all replies for a comment
export async function getAllRepliesService(val:string){
    const reply = await Replies.find({reply:val}).populate({
        path:'user',
        select: "username"
    })
    return reply;
}