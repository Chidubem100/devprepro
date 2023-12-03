import fastify, {FastifyPluginAsync,FastifyInstance,FastifyPluginOptions} from "fastify";
import userRouter from "./routes";
import fp from 'fastify-plugin';
import allRoute from "./routes/index";


const Router:FastifyPluginAsync = async(server:FastifyInstance, options:FastifyPluginOptions)=>{
    server.register(allRoute,{prefix:'/user'})
}

export default fp(Router);