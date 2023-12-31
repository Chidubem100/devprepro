import fastify,{FastifyInstance, FastifyReply,FastifyRequest, HookHandlerDoneFunction} from 'fastify';
import dotenv from 'dotenv';
import {connectDB,disConnectDB} from './config/DbConnection'
import fastifyPlugin from 'fastify-plugin';
import { disconnect } from 'mongoose';
import swagger from "@fastify/swagger";
import { withRefResolver } from 'fastify-zod';
import {version} from '../package.json'

dotenv.config();
const app = fastify();


// APP Config
app.get('/health-check', async(request,reply) =>{
    console.log(request)
    return reply.code(200).send({success:true, msg:'Health working well!!'})
});

// app.register(
   
// )


// app.register(
//    swagger,
//    withRefResolver({
//       routePrefix: '/docs',
//       openapi: {
//          info:{
//             title: 'devprepro',
//             description: "Api for devprepro",
//             version,
//          }
//       }
//    })
// )

const port:number = 5000 || process.env.PORT

async function startServer() {
     try {
        connectDB(process.env.DBURI)
        await app.listen({port:port});
        console.log(`server started on port ${port}`)
     } catch (error) {
        console.log(error)
        disconnect();
        process.exit(1)
     }
    
}

startServer();

export default  app;