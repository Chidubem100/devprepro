import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware";
import { createQuestion } from "./question.controller";

async function questionRoute(server:FastifyInstance) {
    server.post("/", {
        preHandler: authMiddleware,
        handler:createQuestion
    });
    // server.post("/change-password", {
    //     preHandler:authMiddleware,
    //     handler: changePassword
    // });
    // server.post("/request-verification", {
    //     preHandler:authMiddleware,
    //     handler: requestVerification
    // });
    // server.post("/verify-email", {
    //     preHandler:authMiddleware,
    //     handler: verifyEmail
    // });
    // server.post("/edit-bio", {
    //     preHandler:authMiddleware,
    //     handler: editBio
    // });
    // server.post("/set-prefrences", {
    //     preHandler:authMiddleware,
    //     handler: setPrefrences
    // });
    // server.post("/update-email", {
    //     preHandler:authMiddleware,
    //     handler: updateEmail
    // });
    // server.post("/update-username", {
    //     preHandler:authMiddleware,
    //     handler: updateUsername
    // });
    // server.post("/color-mode", {
    //     preHandler:authMiddleware,
    //     handler: changeColorMode
    // });
    // server.post("/theme", {
    //     preHandler:authMiddleware,
    //     handler: changeTheme
    // });
}

export default questionRoute;