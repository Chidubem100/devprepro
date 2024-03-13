import { FastifyRequest,  FastifyReply} from "fastify";
import { findUserById, findUById } from "./user.services";


async function testUserHandler(request: FastifyRequest, reply: FastifyReply){
    console.log(request.user.userId)
    const {
        user: {userId}
    } = request;
    
    const user = await findUById(userId)

    reply.send(user)
}

export {
    testUserHandler
}


// change password
// request account verification
// set prefrences
// change username - can only happen once in 48 hours, email will be sent to notify the user about the username change
// change email- can only happen once in 30 days, email will be sent to confirm the change in email linked to the account
// edit bio

