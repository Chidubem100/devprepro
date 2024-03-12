import { FastifyRequest,  FastifyReply} from "fastify";
import { findUserById } from "./user.services";
// import User from "./user.model";
import { userPayload } from "../../../typings/custom";

interface UserPayload {
    userId: string;
    username: string;
    email: string;
}

interface UserInterface {
    userPayload: UserPayload
    // refreshToken: string | undefined;
    iat: number | undefined; 
    exp: number | undefined
}

async function testUserHandler(request: FastifyRequest, reply: FastifyReply){
    const x = request.user as UserInterface['userPayload'];
    // const q =  request.user.userPayload as UserPayload
    const y: UserInterface = {
        userPayload: x,
        // refreshToken: request.user.refreshToken,
        iat: request.user.iat,
        exp: request.user.exp
    }
    // cosnt x = (request.user as {userPayload: {userId: string}}).userPayload.userId;
    // const x = (request.user as UserInterface).userPayload.userId
    // const {_id: userId} = request;
    // const user = await User.findById(req.user.userId).select('-password')
   console.log(y.userPayload.userId)
//    const x = request.user.userPayload.userId;
//    const userId = (x as {userId:{}}).userPayload.userId;
    // const user1 = await User.findOne({_id: request.user.userId})
    // const user = await findUserById(x.userId)
    // reply.send(user)
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

