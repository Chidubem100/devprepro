import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware";
import { testUserHandler } from "./user.controller";

async function userRoute(server:FastifyInstance) {
    server.get("/test", {
        preHandler: authMiddleware,
        handler: testUserHandler
    })
}

export default userRoute;