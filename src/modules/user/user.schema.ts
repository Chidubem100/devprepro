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
]).default("dark");

const themeEnum = z.enum([
    "default",
    "custom"
]).default("default");

const emailVerificationEnum = z.enum([
    "default",
    "pending",
    "approved"
]).default("default");


const UserSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Field must be a string"
    }).min(2).max(40),

    email: z.string({
        required_error: "Username is required",
        invalid_type_error: "Field must be a string"
    }).email({message: "Invalid Email"}).refine((val) => val.trim() !== '', {message:"Email is required!!"}),
    password: z.string().min(8),
    role: userRoleEnum,
    emailVerificationToken: z.string().nullable(),
    isEmailVerified: z.boolean().default(false),
    verificationRequest: emailVerificationEnum.default("default"),
    isVerified: z.boolean().default(false),
    active: z.boolean().default(true),
    isVerifiedDate: z.date().nullable(),
    passwordToken: z.string().nullable(),
    // passwordTokenExpiration: z.date().nullable(),
    passwordTokenExpiration: z.date().nullable(),
    bio: z.string(),
    preferences: z.array(prefrenceEnum).default([]),
    colorMode: colorModeEnum.default("light"),
    themes: themeEnum.default("default"),
    createdAt: z.date(),
    updatedAt: z.date()
}); 

export default UserSchema;
// export type CreateUserInput = z.infer<typeof UserSchema>;