import User  from "./user.model";

export async function createUser(val:User) {
    console.log("services connected!")
    const user = await User.create({
       email: val.email,
       password: val.password,
       username: val.username,
    });
    return user;    
};

export async function findUserByEmail(val:string){
    const user = await User.findOne({email:val});
    return user;
}

export async function findUserByusername(val:string){
    const user = await User.findOne({username:val})
    return user;
}

export async function findUserById(val:string){
    const user = await User.findById({_id:val});
    return user;
}

export async function findAllUser(){
    const user = await User.find({});
    return user;
}