import { FastifyRequest } from "fastify";



type  userPayload = {
    userId: string,
    username: string,
    email: string,
    // iat?: number,
    // exp?: number

}

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            userId: string,
            username: string,
            email: string
        }
        // user: userPayload
    }
}