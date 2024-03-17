import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestApiError, NotFoundApiError, UnauthenticatedApiError, UnauthorizedApiError } from "../../errors";
import { createQuestions, findByIdAndUpdate, findQuestionById, findQuestions } from "./question.services";
import Question from "./question.model";

async function createQuestion(
    request: FastifyRequest<{Body:{category: string, body: string, username:string, user:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide needed value(s)", 400)
        }

        const {
            body:{category, body}
        } = request;

        if(!category||!body){
            throw new BadRequestApiError("Please provide needed value(s)", 400)
        }

        request.body.user = request.user.userId;
        console.log(typeof(request.body.user))
        request.body.username = request.user.username;
        
        const post = await createQuestions(request.body)
        
        return reply.status(200).send({
            success:true,
            post
        });

    } catch (error) {
        console.log(error)
        return error;
    }
}

async function updateQuestion(
    request: FastifyRequest<{Body:{body:string, category:string}, Params:{postId:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the neede value(s)", 400)
        }

        const {
            params: {postId},
            user: {userId}
        } = request;

        const post = await findQuestionById(postId, userId) 

        if(!post){
            throw new NotFoundApiError("Post not found", 404)
        }

        const x = post.user

        // if(!post.user.equals(request.user)){
        //     throw new UnauthorizedApiError("Can't perform this action", 401);
        // }

        const updatedPosts = await findByIdAndUpdate(postId, userId, request.body)

        return reply.status(200).send({
            success:true,
            updatedPosts
        })
        

    } catch (error) {
        console.log(error)
        return error;
    }
}

async function upVoteQuestion(
    request: FastifyRequest<{Body:{}}>,
    reply: FastifyReply
){
    try {
        
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function allQuestions(
    request: FastifyRequest<{Querystring:{category:string, body:string}}>,
    reply: FastifyReply
){
    try {
        const {body,category} = request.query;
        const queryObject = {};
    
        // if(body){
        //     queryObject.body = {$regex: body, $options: 'i'}
        // }
        // if(category){
        //     queryObject.category = {$regex: category, $options: 'i'}
        // }
        const result = Question.find(queryObject).sort('-createdAt');
        // const result = Post.find(queryObject).sort('-createdAt');
    
        const posts = await result.populate({path: 'user', select:'username'});
        return reply.status(200).send({
            success: true, 
            nbOfHits:posts.length, 
            posts 
        });
    
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function myQuestions(
    request: FastifyRequest<{Body:{}}>,
    reply: FastifyReply
){
    try {
        const {
            user: {userId}
        } = request;
    
        const posts = await findQuestions(userId);

        return reply.status(200).send({
            success: true, 
            posts
        });

    } catch (error) {
        console.log(error)
        return error;
    }
}

async function getQuestion(
    request: FastifyRequest<{Body:{}, Params: {postId:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the neede value(s)", 400)
        }

        const {
            params: {postId},
            user: {userId}
        } = request;

        const post = await findQuestionById(postId, userId) 

        if(!post){
            throw new NotFoundApiError("Post not found", 404)
        }

        return reply.status(200).send({
            success:true,
            post
        });
        

    } catch (error) {
        console.log(error)
        return error;
    }
}


export {
    createQuestion,

}