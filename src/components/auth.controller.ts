import {FastifyReply,FastifyRequest} from 'fastify';


const signUp = <T,>(reply:FastifyReply, request:FastifyRequest):void =>{

    reply.status(200).send({success:true, msg: 'signup route'})
}


const login = <T>(request:FastifyRequest, reply:FastifyReply):void =>{

    reply.status(200).send({success:true, msg: "login route"})
}

export {signUp, login}