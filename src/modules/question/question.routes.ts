import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware";
import { 
    createQuestion,
    updateQuestion,
    upVoteQuestion,
    allQuestions,
    myQuestions,
    getQuestion
} from "./question.controller";

async function questionRoute(server:FastifyInstance) {
    server.post("/", {
        preHandler: authMiddleware,
        handler:createQuestion
    });
    server.post("/update", {
        preHandler:authMiddleware,
        handler: updateQuestion
    });
    server.post("/upvote", {
        preHandler:authMiddleware,
        handler: upVoteQuestion
    });
    server.get("/", {
        preHandler:authMiddleware,
        handler: allQuestions
    });
    server.get("/my-questions/:id", {
        preHandler:authMiddleware,
        handler: myQuestions
    });
    server.post("/get-question/:id", {
        preHandler:authMiddleware,
        handler: getQuestion
    });
}    

export default questionRoute;