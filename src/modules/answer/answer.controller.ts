import { FastifyReply, FastifyRequest } from "fastify";
import mongoose from "mongoose";
import { BadRequestApiError, NotFoundApiError, UnauthorizedApiError } from "../../errors";
import { createAnswerService, findAnswerById, getAllAnswerService, getSingleAnswerService } from "./answer.services";


// create answer
async function createAnswer(
    request: FastifyRequest<{Body:{body:string, user:string, username:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the needed value(s)",400)
        }

        const {body: {body}} = request;
        if(!body){
            throw new BadRequestApiError("Please provide the needed value(s)",400)
        }

        request.body.user = request.user.userId;
        request.body.username = request.user.username;

        const answer = await createAnswerService(request.body)

        return reply.status(201).send({
            success:true,
            msg: "Answer have been submitted",
            answer
        });

    } catch (error) {
        return error;
    }
}

// delete answer
async function deleteAnswer(
    request: FastifyRequest<{Params:{answerId:string}}>,
    reply: FastifyReply
){
    try {
        const {
            params: {answerId},
            user: {userId}
        } = request;

        const answer = await findAnswerById(answerId)
        if(!answer){
            throw new NotFoundApiError("Answer not found", 404)
        }

        const answerIdr = new mongoose.Types.ObjectId(answer.user._id)
        
        if(!answerIdr.equals(request.user.userId)){
            throw new UnauthorizedApiError("Can't perform this action", 401);
        }

        await answer.deleteOne();

        return reply.status(200).send({
            success:true,
            msg: "Answer successfully deleted!"
        })

    } catch (error) {
        return error;
    }
}

// get single answer
async function getSingleAnswer(
    request: FastifyRequest<{Params:{answerId:string}}>,
    reply: FastifyReply
){
    try {
        const {
            params: {answerId},
            user: {userId}
        } = request;

        const answer = await getSingleAnswerService(answerId)

        if(!answer){
            throw new NotFoundApiError("Answer not found", 404)
        }

        return reply.status(200).send({
            success:true,
            answer
        })

    } catch (error) {
        return error;
    }
}

// flag answer correct
async function flagAnswerCorrect(
    request: FastifyRequest<{Params:{answerId:string}}>,
    reply: FastifyReply
){
    try {
        const {
            params: {answerId},
            user: {userId}
        } = request;

        const answer = await findAnswerById(answerId);
        if(!answer){
            throw new NotFoundApiError("Answer nit Found", 404)
        }

        if(answer.flagAnswerCorrect.includes(userId)){
            const indexToRemove = answer.flagAnswerCorrect.indexOf(userId);
            if(indexToRemove){
                answer.flagAnswerCorrect.splice(indexToRemove,1)
            }
            await answer.save();
            const flagUpCount = answer.flagAnswerCorrect.length;
            return reply.status(200).send({
                success:true,
                flaggedCorrectNum: flagUpCount
            });
        }else{
            answer.flagAnswerCorrect.push(userId);
            await answer.save();
            const flagUpCount = answer.flagAnswerCorrect.length;
            return reply.status(200).send({
                success:true,
                msg: "Answer flagged correct!",
                flaggedCorrectNum: flagUpCount
            });
        }
    } catch (error) {
        return error;
    }
}

// flag answer incorrect
async function flagAnswerInCorrect(
    request: FastifyRequest<{Params:{answerId:string}}>,
    reply: FastifyReply
){
    try {
        const {
            params: {answerId},
            user: {userId}
        } = request;

        const answer = await findAnswerById(answerId);
        if(!answer){
            throw new NotFoundApiError("Answer nit Found", 404)
        }
        // answer.flagAnswerIncorrect
        if(answer.flagAnswerIncorrect.includes(userId)){
            const indexToRemove = answer.flagAnswerIncorrect.indexOf(userId);
            if(indexToRemove){
                answer.flagAnswerIncorrect.splice(indexToRemove,1)
            }
            await answer.save();
            const flagUpCount = answer.flagAnswerIncorrect.length;
            return reply.status(200).send({
                success:true,
                flaggedCorrectNum: flagUpCount
            });
        }else{
            answer.flagAnswerIncorrect.push(userId);
            await answer.save();
            const flagUpCount = answer.flagAnswerIncorrect.length;
            return reply.status(200).send({
                success:true,
                msg: "Answer flagged correct!",
                flaggedCorrectNum: flagUpCount
            });
        }
    } catch (error) {
        return error;
    }
}

// all answers for a question
async function getAllAnswer(
    request: FastifyRequest<{Params:{questionId:string}}>,
    reply: FastifyReply
){
    try {
        const {params: {questionId}} = request;
    
        const answers = await getAllAnswerService(questionId);
        if(answers.length < 0){
            return []
        }
        return reply.status(200).send({
            success:true,
            answers
        });
            
    } catch (error) {
        return error;
    }
}


export {
    createAnswer,
    deleteAnswer,
    getSingleAnswer,
    flagAnswerCorrect,
    flagAnswerInCorrect,
    getAllAnswer
}