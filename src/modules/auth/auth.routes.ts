import { FastifyInstance } from "fastify";
import { registerUserHandler } from "./auth.controller";

async function userRoute(server:FastifyInstance) {
    server.post("/register", registerUserHandler)
}

export default userRoute;