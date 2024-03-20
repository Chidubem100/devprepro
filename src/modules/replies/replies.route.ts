import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware";
import { createReply, deleteReply, getAllReplies } from "./replies.controller";

async function RepliesRoute(server:FastifyInstance) {
    server.post("/", {
        preHandler: authMiddleware,
        handler: createReply
    });
    server.delete("/:id", {
        preHandler:authMiddleware,
        handler: deleteReply
    });
    server.get("/:commentId", {
        preHandler:authMiddleware,
        handler: getAllReplies
    });
}    

export default RepliesRoute;