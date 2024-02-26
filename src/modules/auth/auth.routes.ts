import { FastifyInstance } from "fastify";
import { registerUserHandler, loginUserHandler } from "./auth.controller";

async function userRoute(server:FastifyInstance) {
    server.post("/register", registerUserHandler)
    server.post("/login", loginUserHandler)
    // reset password
    // logout
}



export default userRoute;