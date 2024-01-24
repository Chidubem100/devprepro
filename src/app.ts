import fastify,{FastifyInstance, FastifyReply,FastifyRequest, HookHandlerDoneFunction} from 'fastify';
import dotenv from 'dotenv';
import {connectDB,disConnectDB} from './config/DbConnection'
import fastifyPlugin from 'fastify-plugin';
import { disconnect } from 'mongoose';
import { register, withRefResolver } from 'fastify-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

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

// APP Config
app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);


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