import User  from "./user.model";

export async function createUser(val:User) {
    
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

export async function findUById(val:string){
    const user = await User.findById(val).select('-password');
    
    return user;
}

export async function findUserById(val:string){

    const user = await User.findById({_id:val}).select('-password');
    return user;
}


export async function findAllUser(){
    const user = await User.find({});
    return user;
}

// export async function findUserAndUpdate(val:string, username:string){
//     const user = await User.findByIdAndUpdate(val, ,{
//         new: true,
//         runValidators: true
//     })
// }