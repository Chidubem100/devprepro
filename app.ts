import fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';

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

const app = fastify({
    http2:true,
    // https:true,
    // https:{
    //     key: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.key')),
    //     cert: fs.readFileSync(path.join(__dirname, '..', 'https', 'fastify.cert'))
    // },
    logger: true
})

// const app = fastify({logger:envToLogger[environment] ?? true})


app.get('/health-check', async(request,reply) =>{
    reply.code(200).send({success:true, msg: 'Health working well!!'})
})


const port = 5000 || process.env.PORT

async function startServer() {
   try {
        await app.listen({port:port}, (err) =>{
            if(err){
                console.log(err)
                process.exit(1)
            }
            console.log(`server started on port${port}`)
        })
        // console.log(`server started on port${port}`)
   } catch (error) {
        console.log(error)
        process.exit(1)
   }
    
}

startServer();