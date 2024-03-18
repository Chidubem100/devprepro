import { z } from "zod";

const categoryEnum = z.enum([
    "Frontend",
    "Backend",
    "Cyber security",
    "Devops",
    "Developer Relationship",   
    "Cyber engineering",
    "Product management",
    "Web design",
    "System design"
]);


const QuestionSchema = z.object({
    username: z.string(),
    // user: z.string(),
    user: z.object({
        _id:z.string(),
        username: z.string(),
        email:z.string()
    }),
    isPromoted: z.boolean().default(false),
    category: categoryEnum.default("Frontend"),
    body: z.string(),
    upvote: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
}); 

export default QuestionSchema;
