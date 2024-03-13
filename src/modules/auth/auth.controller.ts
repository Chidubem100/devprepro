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
        let refreshToken = crypto.randomBytes(40).toString('hex');
            
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email
        }, "secret", {expiresIn: '10d'});
        
        refreshToken = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            refreshToken}, 
        "secret",{expiresIn:'70d'});    
    
        await Token.create({refreshToken,userAgent,ip,user:user._id})
        
        // console.log(refreshToken)            

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

        let refreshToken;
        
        const existingToken = await Token.findOne({user: isUserExist._id})
        
        if(existingToken){
            
            const {isValid} = existingToken;
            if(!isValid){
                throw new UnauthenticatedApiError("Temporarily prohibited", 401)
            }
            refreshToken = existingToken.refreshToken;
            // console.log(existingToken)
            // console.log(refreshToken)
            
            const userPayload = {
                userId: isUserExist._id,
                username: isUserExist.username,
                email: isUserExist.email
            }
            const accessToken = jwt.sign({
                userId: isUserExist._id,
                username: isUserExist.username,
                email: isUserExist.email
            }, "secret", {expiresIn: '10d'});
            
            // const accessToken = jwt.sign(userPayload, "secret", {expiresIn: '10d'});
                    
            return reply.code(201).send({
                msg: "Success",
                user:{
                    username: isUserExist.username,
                    userId: isUserExist._id,
                    accessToken,
                    refreshToken
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
        refreshToken = crypto.randomBytes(40).toString('hex');
        // console.log(refreshToken)    
        // const userToken = {refreshToken,userAgent,ip,user:isUserExist._id}
            
        await Token.create({refreshToken,userAgent,ip,user:isUserExist._id})
        
        const accessToken = jwt.sign({
            userId: isUserExist._id,
            username: isUserExist.username,
            email: isUserExist.email
        }, "secret", {expiresIn: '10d'});
        refreshToken = jwt.sign({
            userId: isUserExist._id,
            username: isUserExist.username,
            email: isUserExist.email,
            refreshToken}, 
        "secret",{expiresIn:'70d'});
          
        // console.log(refreshToken)
        
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
        console.log(error)
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
        if(!email){
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
 
       if(newPassword !== confirmPassword){
            throw new BadRequestApiError("Password and confirm password doesn't match",400)
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
            }else{
                throw new BadRequestApiError("Something went wrong", 400)
            }
       }

    } catch (error) {
       return error; 
    }
}

// logout

export {
    registerUserHandler,
    loginUserHandler,
    forgotPassword,
    resetPassword
}