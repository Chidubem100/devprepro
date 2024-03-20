import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { BadRequestApiError, NotFoundApiError, UnauthorizedApiError } from "../../errors";
import { createCommentService, findCommentById, getAllCommentService, getSingleCommentService } from "./comment.services";

// create answer
async function createComment(
    request: FastifyRequest<{Body:{commentBody:string, user:string, username:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the needed value(s)",400)
        }

        const {body: {commentBody}} = request;
        if(!commentBody){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }
        
        request.body.user = request.user.userId;
        request.body.username = request.user.username;
        const comment = await createCommentService(request.body);

        return reply.status(201).send({
            success:true,
            msg: "Comment have been submitted",
            comment
        });

    } catch (error) {
        return error;
    }
}

// delete answer
async function deleteComment(
    request: FastifyRequest<{Params:{commentId:string}}>,
    reply: FastifyReply
){
    try {
        const {
            params: {commentId},
            user: {userId}
        } = request;

        const comment =  await findCommentById(commentId)

        if(!comment){
            throw new NotFoundApiError("Comment not found", 404)
        }

        const commentIdr = new mongoose.Types.ObjectId(comment.user._id)
        
        if(!commentIdr.equals(request.user.userId)){
            throw new UnauthorizedApiError("Can't perform this action", 401);
        }

 
        return reply.status(200).send({
            success:true,
            msg: "Comment successfully deleted!"
        })

    } catch (error) {
        return error;
    }
}

// get single answer
async function getSingleComment(
    request: FastifyRequest<{Params:{commentId:string}}>,
    reply: FastifyReply
){
    try {
        const {
            params: {commentId},
            user: {userId}
        } = request;

        const comment = await getSingleCommentService(commentId)

        if(!comment){
            throw new NotFoundApiError("Comment not found",404)
        }

        return reply.status(200).send({
            success:true,
            comment
        })

    } catch (error) {
        return error;
    }
}



// all answers for a question
async function getAllComments(
    request: FastifyRequest<{Params:{answerId:string}}>,
    reply: FastifyReply
){
    try {
        const {params: {answerId}} = request;
        const comments = await getAllCommentService(answerId);
        if(comments.length < 0){
            return []
        }
        return reply.status(200).send({
            success:true,
            comments
        });
            
    } catch (error) {
        return error;
    }
}


export {
    getAllComments,
    deleteComment,
    getSingleComment,
    createComment
}