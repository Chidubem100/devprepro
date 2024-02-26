import { FastifyRequest,  FastifyReply} from "fastify";

async function registerUserHandler(request: FastifyRequest, reply: FastifyReply){
    console.log("sign up page")
}

export {
    registerUserHandler
}


// change password
// request account verification
// set prefrences
// change username - can only happen once in 48 hours, email will be sent to notify the user about the username change
// change email- can only happen once in 30 days, email will be sent to confirm the change in email linked to the account
// edit bio

