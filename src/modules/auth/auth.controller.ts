import { FastifyRequest,  FastifyReply} from "fastify";
import { createUser,findUserByEmail, findUserByusername } from "../user/user.services";
import User from "../user/user.model";
import { isPasswordStrong } from "../../__helper__";
import { BadRequestApiError, UnauthenticatedApiError } from "../../errors";
import crypto from "crypto"
import Token from "./token";
import jwt  from "jsonwebtoken";
import { comparePassword } from "../../utils/comparePassword";

async function registerUserHandler(
    request: FastifyRequest<{
        Body: User
    }>, 
    reply: FastifyReply){
    

    try {
        if(!request.body){
            throw new BadRequestApiError("Pleae provide all needed value(s)", 400)
        }

        const  {username, email, password} = request.body;
        
        if(!username || !email || !password){
            throw new BadRequestApiError("Pleae provide all needed value(s)", 400)
        }

        const isEmailAlreadyExist = await findUserByEmail(email);
        const isUsernameAlreadyExist = await findUserByusername(username);
        const isStrongpassword = isPasswordStrong(password)
        
        if(isEmailAlreadyExist){
            throw new BadRequestApiError("Email already exist", 400) 
        }

        if(isUsernameAlreadyExist){
            throw new BadRequestApiError("Username already exist", 400)
        }

        // validates password
        if(!isStrongpassword){
            throw new BadRequestApiError(
                "Password must contain an uppercase and smallcase letters, a number and a special character", 400
            )
        }        

        const user =  await createUser(request.body)
        
        const userPayload = {
            userId: user._id,
            username: user.username,
            email: user.email
        }

        const userAgent = request.headers['user-agent']
        const ip = request.ip
        let refresh_token = crypto.randomBytes(40).toString('hex');
            
        const userToken = {refresh_token,userAgent,ip,user:user._id}
            
    
        await Token.create(userToken)
        
        const accessToken = jwt.sign(userPayload, "secret", {expiresIn: '1d'});
        const refreshToken = jwt.sign({userPayload,refresh_token}, "secret",{expiresIn:'4d'});
                    
        return reply.code(201).send({
            msg: "Success",
            user:{
                username: user.username,
                userId: user._id,
                accessToken,
                refreshToken
            }
            
        })

    } catch (error) {
        // console.log(error)
        return error;
    }
}

async function loginUserHandler(
    request: FastifyRequest<{Body: User}>,
    reply: FastifyReply
){
    
    try {
        // const { username, password} = request.body;

        if(!request.body){
            throw new BadRequestApiError("Pleae provide all needed value(s)", 400)
        }
        const { username, password} = request.body;


        if(!username || !password){
            throw new BadRequestApiError("Pleae provide all needed value(s)", 400)
        }

        const isUserExist = await findUserByusername(username);

        if(!isUserExist){
            throw new BadRequestApiError("invalid credential(s)",400)
        }

        const isPasswordCorrect = await comparePassword(password, isUserExist.password)

        if(!isPasswordCorrect){
            throw new UnauthenticatedApiError("Invalid credentials", 401)
        }

        let refresh_token:string |null |undefined;

        const existingToken = await Token.findOne({user: isUserExist._id})
        if(existingToken){
            const {isValid} = existingToken;
            if(!isValid){
                throw new UnauthenticatedApiError("Temporarily prohibited", 401)
            }
            refresh_token = existingToken.refreshToken;

            const userPayload = {
                userId: isUserExist._id,
                username: isUserExist.username,
                email: isUserExist.email
            }
    
            const accessToken = jwt.sign(userPayload, "secret", {expiresIn: '1d'});
                    
            return reply.code(201).send({
                msg: "Success",
                user:{
                    username: isUserExist.username,
                    userId: isUserExist._id,
                    accessToken,
                    refreshToken: refresh_token
                }
            
            })

        }

        const userPayload = {
            userId: isUserExist._id,
            username: isUserExist.username,
            email: isUserExist.email
        }

        const userAgent = request.headers['user-agent']
        const ip = request.ip
        refresh_token = crypto.randomBytes(40).toString('hex');
            
        const userToken = {refresh_token,userAgent,ip,user:isUserExist._id}
            
    
        await Token.create(userToken)
        
        const accessToken = jwt.sign(userPayload, "secret", {expiresIn: '1d'});
        const refreshToken = jwt.sign({userPayload,refresh_token}, "secret",{expiresIn:'4d'});
          
        console.log(isUserExist)
        
        return reply.code(201).send({
            msg: "Success",
            user:{
                username: isUserExist.username,
                userId: isUserExist._id,
                accessToken,
                refreshToken
            }
            
        })

    } catch (error) {
        // console.log(error)
        return error;
    }
}


// RESET passsword
async function forgotPassword(
    request: FastifyRequest<{Body:{email:string}}>,
    reply: FastifyReply
    ) {
    
    try {
        if(!request.body){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }
 
        const {email} = request.body
        if(email){
            throw new BadRequestApiError("Please provide the needed value(s)", 400)
        }

        const isUserExist = await findUserByEmail(email)

        if(isUserExist){
            const passwordToken: string = crypto.randomBytes(70).toString('hex');

            const tenMins = 1000 * 60 * 10;
            const passwordTokenExpirationDate = new Date(Date.now() + tenMins);

            isUserExist.passwordToken = crypto.createHash('md5').update(passwordToken).digest('hex') // hash password reset token
            isUserExist.passwordTokenExpiration = passwordTokenExpirationDate;

            // send email to user

            await isUserExist.save();
            return reply.status(200).send({
                msg: "Password reset token",
                passwordToken
            }) // to be removed in production

        }

        // return reply.status(200).send({
        //     succcess:true,
        //     msg: "Please check your email for reset password link"
        // }) // to be added in production
    } catch (error) {
        return error
    }
}

async function resetPassword(
    request: FastifyRequest<{
        Body: {
            newPassword:string, 
            confirmPassword: string
            token: string,
            email: string
        }
    }>, 
    reply: FastifyReply
) {
    try {
       if(!request.body){
            throw new BadRequestApiError("Please provide the needed value(s)", 400) 
       } 
       const {token,email,newPassword, confirmPassword} = request.body
 
       if(!token || !email || !newPassword || !confirmPassword){
            throw new BadRequestApiError("Provide the needed value(s)", 400)
       }
 
       const user = await findUserByEmail(email)

       if(user){
            const currentDate: Date = new Date();
            const hashed: string = crypto.createHash('md5').update(token).digest('hex')

            if(
                user.passwordToken === hashed && 
                user.passwordTokenExpiration !== null &&
                user.passwordTokenExpiration > currentDate
            ){
                user.password = newPassword,
                user.passwordToken = null,
                user.passwordTokenExpiration = null,
          
                await user.save();

                return reply.status(200).send({
                  success: true,
                  msg: "Password changeed successfully"  
                })
            }
       }

    } catch (error) {
       return error; 
    }
}

// logout

export {
    registerUserHandler,
    loginUserHandler
}