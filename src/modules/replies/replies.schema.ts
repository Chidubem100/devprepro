import { z } from "zod";


const RepliesSchema = z.object({
    username: z.string(),
    user: z.object({
        _id:z.string(),
        username: z.string(),
        email:z.string()
    }),
    comment: z.object({
        _id:z.string()
    }),
    replyBody: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}); 

export default RepliesSchema;
