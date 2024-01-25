import { FastifyRequest,  FastifyReply} from "fastify";
import { createUser } from "../user/user.services";
import { CreateUserInput } from "../user/user.schema";

async function registerUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput
    }>, 
    reply: FastifyReply){
    
    console.log("sign up page")

    const  body = request.body;
    console.log(body)
    try {
        const user =  await createUser(body)
        console.log(user)
        return reply.code(201).send(user)
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}

export {
    registerUserHandler
}