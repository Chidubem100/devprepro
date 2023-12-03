import fastify,{FastifyReply,FastifyRequest} from 'fastify';
import dotenv from 'dotenv';
import log from './config/logger';
import {connectDB,disConnectDB} from './src/dbConfig/DbConnection'
import{notFound,errorHandler} from './src/middleware/index'
import { levels, pino } from 'pino';
import Router from './src/index';
import allRoute from './src/routes';

dotenv.config();
const app = fastify({
     trustProxy:true,
     logger: {
          level: 'info',
          timestamp: pino.stdTimeFunctions.isoTime,
     },
});




// APP Config
app.register(Router, {prefix:'/api/v1'})


app.get('/health-check', async(request,reply) =>{
    console.log(request)
    return reply.code(200).send({success:true, msg:'Health working well!!'})
})

// app.register(notFound)
app.register(errorHandler)


const port:number = 5000 || process.env.PORT

async function startServer() {
   try {
        connectDB(process.env.DBURI)
        await app.listen({port:port});
        log.info(`Server running on port ${port}`)
        // console.log(`server started on port${port}`)
   } catch (error) {
        console.log(error)
        process.exit(1)
   }
    
}

startServer();

export default  app;