import { z } from "zod";

const userRoleEnum = z.enum([
    "user"
]).default("user");

const prefrenceEnum = z.enum([
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

const colorModeEnum = z.enum([
    "light", 
    "dark"
]).default("light");

const themeEnum = z.enum([
    "default",
    "custom"
]).default("default");


export const userSchema = z.object({
    _id: z.string().optional(),
    username: z.string().min(2).max(40).refine((val) => val.trim() !== '', {message:"Username is required!!"}),
    email: z.string().email({message: "Invalid Email"}).refine((val) => val.trim() !== '', {message:"Email is required!!"}),
    password: z.string().min(8).refine((val) => val.trim() !== "", {message: "Password is required!!"}),
    role: userRoleEnum,
    verificationToken: z.string().nullable(),
    isVerified: z.boolean().default(false),
    isVerifiedDate: z.date().nullable(),
    passwordToken: z.string().nullable(),
    passwordTokenExpiration: z.date().nullable(),
    bio: z.string(),
    preferences: z.array(prefrenceEnum).default([]),
    colorMode: colorModeEnum.default("light"),
    themes: z.array(themeEnum).default([]),
});