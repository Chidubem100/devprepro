import bcrypt from "bcrypt";

async function comparePassword(password:string, hashedPassword: string):Promise<Boolean> {
    return await bcrypt.compare(password, hashedPassword)
}

export {comparePassword}