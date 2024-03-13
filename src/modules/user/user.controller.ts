import { FastifyRequest,  FastifyReply} from "fastify";
import { findUserById, findUById } from "./user.services";
import { BadRequestApiError } from "../../errors";
import { isPasswordStrong } from "../../__helper__";
import { comparePassword } from "../../utils/comparePassword";


async function testUserHandler(request: FastifyRequest, reply: FastifyReply){
    console.log(request.user.userId)
    const {
        user: {userId}
    } = request;
    
    const user = await findUserById(userId)

    reply.send(user)
}

// change password
async function changePassword(
    request: FastifyRequest<{Body:{
        password: string,
        newPassword: string,
        confirmPassword: string
    }}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }

        const {
            user: {userId}
        } = request;
        const {password, confirmPassword, newPassword} = request.body;
        const isNewPasswordStrong = isPasswordStrong(password);
        const isConfirmPasswordStrong = isPasswordStrong(confirmPassword);

        if(!password || !confirmPassword || !newPassword){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }

        if(newPassword !== confirmPassword){
            throw new BadRequestApiError("New password and confirm password doesn't match", 400)
        }

        if(!isConfirmPasswordStrong || !isNewPasswordStrong){
                
            throw new BadRequestApiError("Password must contain an uppercase and smallcase letters, a number and special character",400)
        }

        const user = await findUserById(userId);
        if(user){
            const isPasswordCorrect = comparePassword(password, user.password)

            if(!isPasswordCorrect){
                throw new BadRequestApiError("Invalid credential(s)",400)

            }
            user.password = newPassword,
            await user.save();
            reply.status(200).send({
                success: true,
                msg: "Password have been changed"
            })
        }else{
            throw new BadRequestApiError("Something went wrong",400)
        }
        
    } catch (error) {
        console.log(error)
        return error
    }
}
// request account verification
async function requestVerification(){

}
// set prefrences
// change username - can only happen once in 48 hours, email will be sent to notify the user about the username change
// change email- can only happen once in 30 days, email will be sent to confirm the change in email linked to the account
// edit bio

export {
    testUserHandler,
    changePassword,
    requestVerification,
}
