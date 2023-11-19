import fastify from 'fastify';
import dotenv from 'dotenv'

dotenv.config();

// APP Config
const envToLogger = {
     development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            },
        },
    },
    production:true,
    test:false,
}


const app = fastify({logger:true});

app.get('/health-check', async(request,reply) =>{
    reply.code(200).send({success:true, msg:'Health working well!!'})
})


const port:number = 5000 || process.env.PORT

async function startServer() {
   try {
        await app.listen({port:port});
        console.log(`server started on port${port}`)
   } catch (error) {
        console.log(error)
        process.exit(1)
   }
    
}

startServer();

exports.default = app;