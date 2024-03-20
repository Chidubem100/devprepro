import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware";
import { 
    createAnswer,
    deleteAnswer,
    getSingleAnswer,
    flagAnswerCorrect,
    flagAnswerInCorrect,
    getAllAnswer 
} from "./answer.controller";

async function answerRoute(server:FastifyInstance) {
    server.post("/", {
        preHandler: authMiddleware,
        handler:createAnswer
    });
    server.delete("/:id", {
        preHandler:authMiddleware,
        handler: deleteAnswer
    });
    server.get("/:id", {
        preHandler:authMiddleware,
        handler: getSingleAnswer
    });
    server.get("/:questionId", {
        preHandler:authMiddleware,
        handler: getAllAnswer
    });
    server.post("flag/:id", {
        preHandler:authMiddleware,
        handler: flagAnswerCorrect
    });
    server.post("unflag/:id", {
        preHandler:authMiddleware,
        handler: flagAnswerInCorrect
    });
}    

export default answerRoute;