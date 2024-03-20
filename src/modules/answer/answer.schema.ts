import { z } from "zod";


const AnswerSchema = z.object({
    username: z.string(),
    user: z.object({
        _id:z.string(),
        username: z.string(),
        email:z.string()
    }),
    question: z.object({
        _id:z.string()
    }),
    flagAnswerCorrect: z.array(z.string()),
    flagAnswerIncorrect: z.array(z.string()),
    body: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}); 

export default AnswerSchema;
