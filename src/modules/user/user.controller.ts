import { FastifyRequest,  FastifyReply} from "fastify";
import { findUserById, findUById } from "./user.services";
import { BadRequestApiError, NotFoundApiError } from "../../errors";
import { isPasswordStrong } from "../../__helper__";
import { comparePassword } from "../../utils/comparePassword";
import {randomBytes} from "crypto"

async function myProfile(request: FastifyRequest, reply: FastifyReply){
    // console.log(request.user.userId)
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
async function requestVerification(
    request: FastifyRequest,
    reply: FastifyReply
){
    try {
        const {
            user:{userId}
        } = request;

        const user = await findUserById(userId)

        if(!user){
            throw new BadRequestApiError("User not found", 400)
        }

        if(!user.active){
            throw new BadRequestApiError("Request can't be processed, account is inactive",400)
        }
        const createdAt = user.createdAt.getTime();
        const daysSinceCreation = Math.floor((Date.now() - createdAt)/ (1000* 3600 * 24))

        if(daysSinceCreation<60){
            throw new BadRequestApiError("User must wait for 60 days upon registration to request for verification", 400)
        }
     
        user.verificationRequest = 'pending'
        await user.save();
        const emailVerificationToken = randomBytes(40).toString('hex');
        const orgin = 'http://localhost:4000'; // to be changed in prouction

        // email will be sent with email verification link

        return reply.status(200).send({
            success: true,
            emailVerificationToken, // to be removed in production
            msg: "Successfully requested for verification. Verify your email by clicking the link sent to your email to complete this process"
        })
    
    } catch (error) {
        console.log(error)
        return error;
    }
}
// email verification
async function verifyEmail(
    request: FastifyRequest<{Body: {emailVerificationToken:string, email:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }
        
        const {
            user: {userId}, 
            body:{email, emailVerificationToken}
        } = request;
    
        if(!email||!emailVerificationToken){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }
    
        const user =  await findUserById(userId);
        if(!user){
            throw new NotFoundApiError("Verification failed", 404)
        }
    
        if(user.emailVerificationToken !== emailVerificationToken){
            throw new NotFoundApiError("Verification failed", 400)
        }
    
        user.emailVerificationToken = '',
        user.isEmailVerified = true,
        user.verificationRequest = "approved"
    
        await user.save();
    
        return reply.status(200).send({
            success:true,
            msg: "Email have been verified!"
        });
    } catch (error) {
        console.log(error)
        return error;
    }
}

// edit bio
async function editBio(
    request: FastifyRequest<{Body: {bio:string}}>,
    reply: FastifyReply
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Provide the needed value(s)",400)
        }
    
        const {
            user:{userId},
            body: {bio}
        } = request;
    
        if(!bio){
            throw new BadRequestApiError("Provide the needed value(s)",400)
        }
    
        const user = await findUserById(userId);
        if(!user){
            throw new NotFoundApiError("User not found", 404)
        }
    
        user.bio = bio,
        await user.save();
        return reply.status(200).send({
            success:true,
            msg: "Profile bio updated successfully!"
        })
    } catch (error) {
        console.log(error)
        return error;
    }
}

// set prefrences //to be worked later
async function setPrefrences(
    request: FastifyRequest<{Body: {preferences:[]}}>,
    reply: FastifyReply    
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Provide the needed value(s)",400)
        }

        const {
            user:{userId},
            body: {preferences}
        } = request;

        const user =  await findUserById(userId)

        if(!user){
            throw new NotFoundApiError("User not found", 404)
        };

        // if(!preferences){
        //     throw new BadRequestApiError("Pleae")
        // }
        if(Array.isArray(preferences)){
            preferences.forEach((preference:any) =>{
                if(user.preferences.includes(preference)){
                    user.preferences.push(preference)
                }{
                    throw new BadRequestApiError("Something went wrong", 400)
                }
            })
        }

        await user.save();

        return reply.status(200).send({
            success:true,
            msg: "Preferences updated"
        });

    } catch (error) {
        console.log(error)
        return error;
    }
}

// change username - can only happen once in 48 hours, email will be sent to notify the user about the username change
async function updateUsername(
    request: FastifyRequest<{Body: {username:string}}>,
    reply: FastifyReply    
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Provide the needed value(s)",400)
        }

        const {
            user:{userId},
            body: {username}
        } = request;

        if(!username){
            throw new BadRequestApiError("Provide the needed value(s)",400)
        }

        const user = await findUserById(userId)

        if(!user){
            throw new NotFoundApiError("User not found", 404)
        }

        if(!user.active){
            throw new BadRequestApiError("Request can't be processed, account is inactive",400)
        }
        const createdAt = user.createdAt.getTime();
        const daysSinceCreation = Math.floor((Date.now() - createdAt)/ (1000* 3600 * 24))

        if(daysSinceCreation<2){
            throw new BadRequestApiError("User must wait for 2 days upon registration before changing their usernsme", 400)
        }

        user.username = username,
        await user.save();
        return reply.status(200).send({
            success:true,
            msg: "Username successfully updated!"
        })
        
    } catch (error) {
        console.log(error)
        return error;
    }
   
}

// change email- can only happen once in 30 days, email will be sent to confirm the change in email linked to the account
// later feature OTP will be sent to email to confirm changes
async function updateEmail(
    request: FastifyRequest<{Body: {email:string}}>,
    reply: FastifyReply    
){
    try {
        if(!request.body){
            throw new BadRequestApiError("Provide the needed value(s)",400)
        }

        const {
            user:{userId},
            body: {email}
        } = request;

        if(!email){
            throw new BadRequestApiError("Provide the needed value(s)",400)
        }

        const user = await findUserById(userId)

        if(!user){
            throw new NotFoundApiError("User not found", 404)
        }

        if(!user.active){
            throw new BadRequestApiError("Request can't be processed, account is inactive",400)
        }
        const createdAt = user.createdAt.getTime();
        const daysSinceCreation = Math.floor((Date.now() - createdAt)/ (1000* 3600 * 24))

        if(daysSinceCreation<30){
            throw new BadRequestApiError("User must wait for 30 days upon registration before changing their email", 400)
        }

        const orgin = 'http://localhost:4000'; // to be changed in prouction
        //email will be sent to the old email informing them about the changes 

        user.email = email,
        await user.save();
        return reply.status(200).send({
            success:true,
            msg: "Email successfully updated!"
        })

    } catch (error) {
        console.log(error)
        return error;
    }

}

async function changeColorMode(
    request: FastifyRequest<{}>,
    reply: FastifyReply
){
    if(!request.body){
        throw new BadRequestApiError("Provide the needed value(s)",400)
    }

    const {
        user:{userId},
    } = request;

    const user = await findUserById(userId);

    if(!user){
        throw new NotFoundApiError("user not found",  404)
    }

    user.colorMode = "light",
    await user.save();
    return reply.status(200).send({
        success: true,
        msg: "Background color changed!"
    })
}

async function changeTheme(
    request: FastifyRequest<{}>,
    reply: FastifyReply
){
    if(!request.body){
        throw new BadRequestApiError("Provide the needed value(s)",400)
    }

    const {
        user:{userId},
    } = request;

    const user = await findUserById(userId);

    if(!user){
        throw new NotFoundApiError("user not found",  404)
    }

    user.themes = "custom",

    await user.save();
    return reply.status(200).send({
        success: true,
        msg: "Background color changed!"
    })
}


export {
    myProfile,
    changePassword,
    requestVerification,
    verifyEmail,
    editBio,
    setPrefrences,
    updateEmail,
    updateUsername,
    changeColorMode,
    changeTheme
}
