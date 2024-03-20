import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { BadRequestApiError, NotFoundApiError, UnauthorizedApiError } from "../../errors";
import { createReplyService, findReplyById, getAllRepliesService } from "./replies.services";

// create reply
async function createReply(
    request: FastifyRequest<{Body:{replyBody:string, user:string, username:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the needed value(s)",400)
        }

        const {body: {replyBody}} = request;
        if(!replyBody){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }
        
        request.body.user = request.user.userId;
        request.body.username = request.user.username;

        const replies = await createReplyService(request.body)

        return reply.status(201).send({
            success:true,
            msg: "Reply have been submitted",
            replies
        });

    } catch (error) {
        return error;
    }
}

// delete answer
async function deleteReply(
    request: FastifyRequest<{Params:{replyId:string}}>,
    reply: FastifyReply
){
    try {
        const {
            params: {replyId},
            user: {userId}
        } = request;

        const replies =  await findReplyById(replyId);

        if(!replies){
            throw new NotFoundApiError("Comment not found", 404)
        }

        const replyIdr = new mongoose.Types.ObjectId(replies.user._id)
        
        if(!replyIdr.equals(request.user.userId)){
            throw new UnauthorizedApiError("Can't perform this action", 401);
        }

        return reply.status(200).send({
            success:true,
            msg: "Reply successfully deleted!"
        })

    } catch (error) {
        return error;
    }
}


// all replies for a comment
async function getAllReplies(
    request: FastifyRequest<{Params:{commentId:string}}>,
    reply: FastifyReply
){
    try {
        const {params: {commentId}} = request;
        const replies = await getAllRepliesService(commentId)
        if(replies.length < 0){
            return []
        }
        return reply.status(200).send({
            success:true,
            replies
        });
            
    } catch (error) {
        return error;
    }
}


export {
    createReply,
    deleteReply,
    getAllReplies
}