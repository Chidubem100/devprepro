import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware";
import { 
     createQuestion,
     upVoteQuestion,
     updateQuestion,
     allQuestions,
     myQuestions,
     getQuestion
} from "./question.controller";

async function questionRoute(server:FastifyInstance) {
    server.post("/", {
        preHandler: authMiddleware,
        handler:createQuestion
    });
    server.patch("/:id", {
        preHandler:authMiddleware,
        handler: updateQuestion
    });
    server.get("/", {
        preHandler:authMiddleware,
        handler: allQuestions
    });
    server.get("/:id", {
        preHandler:authMiddleware,
        handler: getQuestion
    });
    server.get("/my-questions", {
        preHandler:authMiddleware,
        handler: myQuestions
    });
    server.post("/:id", {
        preHandler:authMiddleware,
        handler: upVoteQuestion
    });
}    

export default questionRoute;