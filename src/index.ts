import fastify from "fastify";
import userRouter from "./routes";
import allroute from './routes/index';
import def from "ajv/dist/vocabularies/discriminator";
const router = fastify();

router.register(allroute,{prefix:'/user'});
export default router;

// const x = (request,reply,done) =>{
//     router.register(userRouter)
//     done()
// }

// router.register(userRouter)


// export default router;


