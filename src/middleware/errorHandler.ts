import HttpExceptions from "../helpers/httpExceptions";
import fastify,{FastifyReply,FastifyRequest, HookHandlerDoneFunction} from "fastify";


// Handle cast errors
const handleCastErrorDB = (err:any) =>{
    const message = `invalid ${err.path} : ${err.value}`
    return new HttpExceptions(message, 400)
}
// Handle duplicate errors
const handleDuplicateFieldDB = (err:any) =>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `${value} is already in use. Please pick another value`
    return new HttpExceptions(message,400)
}
// Handle validation errors
const handleValidationErrorDB = (err: any) => {
    let errArr: Array<{}> = [];
    Object.keys(err.errors).forEach((key, index) => {
        errArr.push({ [key]: { message: err.errors[key]["message"] } });
    });
    return new HttpExceptions("validation error", 422, errArr);
};
// Send production errors
const sendErrorProd = (err:any, reply:FastifyReply) =>{
    reply.status(err.statusCode).send({
        status: err.status,
        error: err,
        msg: err.message,
        errors: err.errors,
    });
}
// Send development errors
const sendErrordev = (err:any, reply:FastifyReply) =>{
    reply.status(err.statusCode).send({
        error: err,
        errors: err.errors,
        msg: err.message,
        stack: err.stack,
    })
}
// error handler
export const errorHandler = (
    error: any,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
) =>{
    error.statusCode = error.statusCode;
    error.errors = error.errors || null;
    if(process.env.NODE_ENV === 'development'){
        sendErrordev(error,reply)
    }else if(process.env.NODE_ENV === 'production'){
        let err = JSON.parse(JSON.stringify(error))
        if(err.name === 'CastError') err = handleCastErrorDB(err)
        if(err.code === 11000) err = handleDuplicateFieldDB(err)
        if(err.name === 'ValidationError') err = handleValidationErrorDB(err)

        sendErrorProd(err, reply)
    }
    done()
} 