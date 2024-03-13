import * as jwt from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthenticatedApiError } from "../errors";
import Token from '../modules/auth/token';
import { userPayload } from "../../typings/custom";
import { isRefreshTokenExpired } from "../__helper__";

function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply,
    done: (error?:Error) => void
){
    
    const {accesstoken, refreshtoken} = request.headers;
    // console.log(refreshToken)
  
    if(!accesstoken || !refreshtoken){
        throw new UnauthenticatedApiError("Unauthorized", 401)
    }

    try {
        const accessTokens = Array.isArray(accesstoken) ? accesstoken[0] : accesstoken;
        const refreshToken = Array.isArray(refreshtoken) ? refreshtoken[0] : refreshtoken;
        // console.log(refreshToken)
        if(accesstoken){
            
            const refreshPayload = jwt.verify(refreshToken,'secret');
            if(refreshPayload){
                const payload = jwt.verify(accessTokens, 'secret') as {userId: string, username: string, email: string}
                request.user = payload;
                // console.log(request.user)
            }else{
                throw new UnauthenticatedApiError("Login Again", 401)
                
            }

            return done();
        }
    } catch (error) {
        console.log(error)
        throw new UnauthenticatedApiError("Login Again", 401)
    }
}

async function refreshTokenAuth(
    request: FastifyRequest,
    reply: FastifyReply,
    // done: (error?: Error) => void
){
    try {
        const {refreshtoken} = request.headers;
        if(!refreshtoken){
            throw new UnauthenticatedApiError("Login again", 401)
        }
        const refreshToken = Array.isArray(refreshtoken) ? refreshtoken[0] : refreshtoken;

        if (refreshtoken) {
            const payload = jwt.verify(refreshToken, 'secret');
            // console.log(payload)   
           
            const checkRefreshToken = isRefreshTokenExpired(payload);
            if(checkRefreshToken){
                throw new UnauthenticatedApiError("Session expired, Login again", 401)
            }
            
            const userId = (payload as {userId:string}).userId;
            const username = (payload as {username:string}).username;
            const email = (payload as {email:string}).email;
            
            const existingToken = await Token.findOne({
                user: userId,
                refreshToken: refreshToken
            });
            // console.log(existingToken)

            if(!existingToken){
                throw new UnauthenticatedApiError("Login again", 401)
            }
            
            const accessToken = jwt.sign({userId,username,email}, 'secret')
        
            return reply.code(201).send({
                accessToken
            })

        } else {
            return false;    
        }
        
    } catch (error) {
        console.log(error)
        throw new UnauthenticatedApiError("Login again",401)
    }
}


export {authMiddleware, refreshTokenAuth}

