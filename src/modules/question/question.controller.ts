import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestApiError, NotFoundApiError } from "../../errors";
import { createQuestions, findByIdAndUpdate, findQuestionById } from "./question.services";

async function createQuestion(
    request: FastifyRequest<{Body:{category: string, body: string, username:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide needed value(s)", 400)
        }

        const {
            body:{category, body}
        } = request;

        if(category||body){
            throw new BadRequestApiError("Please provide needed value(s)", 400)
        }

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
    request: FastifyRequest<{Body:{}, Params:{postId:string}}>,
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

        // if(!post.user._id.equals(req.user.userId)){
            // throw new CustomApiError.UnauthorizedError('UNAUTHORIZED');
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
    request: FastifyRequest<{Body:{}}>,
    reply: FastifyReply
){
    try {
        const {title,author, genre, category} = req.query;
        const queryObject = {};
    
        if(title){
            queryObject.bookTitle = {$regex: title, $options: 'i'};
            
        }
        if(author){
            queryObject.authorName = {$regex: author, $options: 'i'}
        }
        if(genre && genre !== 'all'){
            queryObject.genres = genre;
        }
        if(category && category !== 'all'){
            queryObject.bookCategory = category;
        }
        
        const result = Post.find(queryObject).sort('-createdAt');
    
        const posts = await result.populate({path: 'user', select:'username'});
        res.status(StatusCodes.OK).json({success: true, nbOfHits:posts.length, posts });
    
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
        } = req;
    
        const posts = await Post.find({user:userId});
        res.status(StatusCodes.OK).json({success: true, posts})
    } catch (error) {
        console.log(error)
        return error;
    }
}

async function getQuestion(
    request: FastifyRequest<{Body:{}}>,
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

        // if(!post.user._id.equals(req.user.userId)){
            // throw new CustomApiError.UnauthorizedError('UNAUTHORIZED');
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


export {
    createQuestion,

}