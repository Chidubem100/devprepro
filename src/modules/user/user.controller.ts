import { FastifyRequest,  FastifyReply} from "fastify";

async function registerUserHandler(request: FastifyRequest, reply: FastifyReply){
    console.log("sign up page")
}

export {
    registerUserHandler
}