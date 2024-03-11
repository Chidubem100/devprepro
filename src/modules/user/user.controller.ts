import { FastifyRequest,  FastifyReply} from "fastify";
import { findUserById } from "./user.services";
import User from "./user.model";
import { userPayload } from "../../../typings/custom";

async function testUserHandler(request: FastifyRequest, reply: FastifyReply){
    // const {_id: userId} = request;
    // const user = await User.findById(req.user.userId).select('-password')
   console.log(request.user["iat"])
//    const x = request.user;
//    const userId = (x as {userId:{}}).userPayload.userId;
    // const user1 = await User.findOne({_id: request.user.userId})
    const user = await findUserById(request.user.userId)
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

