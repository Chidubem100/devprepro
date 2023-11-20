import { FastifyReply,FastifyRequest } from "fastify";


const notFound = (request:FastifyRequest,reply:FastifyReply) => {
    reply.status(404).send({success: true,  msg: 'Route does not exist'})
} 
export default notFound;