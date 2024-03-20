import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware";
import { 
    createComment,
    getAllComments,
    getSingleComment,
    deleteComment 
} from "./comment.controller";

async function commentRoute(server:FastifyInstance) {
    server.post("/", {
        preHandler: authMiddleware,
        handler:createComment
    });
    server.delete("/:id", {
        preHandler:authMiddleware,
        handler: deleteComment
    });
    server.get("/:id", {
        preHandler:authMiddleware,
        handler: getSingleComment
    });
    server.get("/:answerId", {
        preHandler:authMiddleware,
        handler: getAllComments
    });
}    

export default commentRoute;