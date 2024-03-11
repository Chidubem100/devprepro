import { FastifyInstance } from "fastify";
import { registerUserHandler, loginUserHandler, forgotPassword, resetPassword } from "./auth.controller";
import { refreshTokenAuth } from "../../middleware";


async function userRoute(server:FastifyInstance) {
    server.post("/register", registerUserHandler)
    server.post("/login", loginUserHandler)
    server.post("/forgot-password", forgotPassword)
    server.post("/reset-password", resetPassword)// reset password
    server.post("/refresh-token", refreshTokenAuth)
    // logout
}

export default userRoute;