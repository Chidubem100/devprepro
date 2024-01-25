import {userModel}  from "./user.model";
import { CreateUserInput } from "./user.schema";

export async function createUser(val:CreateUserInput) {
    const user = await userModel.create({
        data:val,
    });
    return user;
};

export async function findUserByEmail(val:string){
    const user = await userModel.findById({data:val});
    return user;
}