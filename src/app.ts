import fastify,{FastifyInstance, FastifyReply,FastifyRequest, HookHandlerDoneFunction} from 'fastify';
import dotenv from 'dotenv';
import {connectDB,disConnectDB} from './config/DbConnection'
import fastifyPlugin from 'fastify-plugin';
import { disconnect } from 'mongoose';
import { register, withRefResolver } from 'fastify-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import userRoute from './modules/user/user.routes';
import authRoute from './modules/auth/auth.routes';
import questionRoute from './modules/question/question.routes';
import answerRoute from './modules/answer/answer.route';
import commentRoute from './modules/comment/comment.route';
import RepliesRoute from './modules/replies/replies.route';
import { errorHandler } from './errors';
import { deleteDatabase } from './config/dropDb';

dotenv.config();
const app = fastify();


const swaggerOptions = {
   swagger: {
      info:{
         title: 'Devprepro',
         description: " Devprepro documentation",
         version: '1.0.0'
      },
      host: "localhost:5000",
      schemes: ['http', "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [{name:"default", description: "default"}]
   },
};

const swaggerUiOptions = {
   routePrefix: "/docs",
   exposeRoute: true
}

// deleteDatabase(process.env.DBURI);

// APP Config
app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);
app.register(userRoute, {prefix: "/api/v1/user"});
app.register(questionRoute, {prefix: "/api/v1/question"});
app.register(answerRoute, {prefix: "/api/v1/answer"});
app.register(commentRoute, {prefix: "/api/v1/comment"});
app.register(RepliesRoute, {prefix: "/api/v1/reply"})
app.register(authRoute, {prefix:"/api/v1"});
app.register(errorHandler);

app.register((app, options, done) =>{
   app.get("/", {
      schema: {
         tags: ["default"],
         response: {
            200: {
               type: "object",
               properties: {
                  response: {type:"string"},
               },
            },
         },         
      },
      handler: (req,res) =>{
         res.send({response:"Testing shits out!!"})
      },
   });
   done();
});

app.get('/health-check', async(request,reply) =>{
   //  console.log(request)
    return reply.code(200).send({success:true, msg:'Health working well!!'})
});

const port:number = 2040 || process.env.PORT

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