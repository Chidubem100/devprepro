import fp from "fastify-plugin";
import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from "fastify";


async function errorHandler(
    fastify: FastifyInstance
){
    fastify.addHook('onError', ( request: FastifyRequest, reply: FastifyReply, error: FastifyError,done: () => void) =>{
        let customError = {
            // set default
            statusCode: error.statusCode || 500,
            msg: error.message || 'Something went wrong try again later',
        };
        console.log(error)
        if((error as any).name === 'ValidationError'){
            customError.msg = Object.values(error)
              .map((item) => item.message)
              .join(',');
            customError.statusCode = 400;
        }

        if((error as any).code === 11000){
            customError.msg = `Duplicate value enterd`;
            customError.statusCode = 400;
        }
         
        if((error as any).code === 'CastError'){
            customError.msg = `No item found with such id`;
            customError.statusCode = 404;
        }
         
        
        return reply.status(customError.statusCode).send({ msg: customError.msg });
    });
}

export default fp(errorHandler);