import { z } from "zod";


const CommentSchema = z.object({
    username: z.string(),
    user: z.object({
        _id:z.string(),
        username: z.string(),
        email:z.string()
    }),
    answer: z.object({
        _id:z.string()
    }),
    commentBody: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}); 

export default CommentSchema;
