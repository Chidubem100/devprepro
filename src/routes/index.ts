import fastify,{FastifyInstance,
    FastifyPluginOptions,
    FastifyPluginAsync,    
    FastifyReply,
    FastifyRequest
} from "fastify";
import fp from "fastify-plugin";
import ajv from "./ajvLib";
import fastifyCookie from "@fastify/cookie";

// fastify.post
const opt =  {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: {type: 'string'}
                }
            }
        }
    },
    handler: function(request: FastifyRequest, reply:FastifyReply){
        reply.send({hello: true})
    }
}

const oppt = {
    schema: {
        body: ajv.getSchema("urn:schema:request:user")?.schema,
        // headers: ajv.getSchema("urn:schema:request:UserAccessToken")?.schema
    },
    handler: function(request: FastifyRequest, reply:FastifyReply){
        console.log(request.body)
        reply.send({success: true, msg: `ip address is ${request.ip}, body is ${request.body}`})
    }
}


const allRoute:FastifyPluginAsync = async(server:FastifyInstance, options: FastifyPluginOptions) =>{
    server.post('/', opt);
    server.get('/all', function(request:FastifyRequest,reply:FastifyReply){
        const x:string = `total is ${34+20}`
        console.log(x)
        console.log(request.ip);
        reply.send({msg:x})     
    });
    server.post('/post', oppt).register(fastifyCookie).setValidatorCompiler(({schema,method,url,httpPart}) =>{
        return ajv.compile(schema)
    })
}


export default fp(allRoute);
