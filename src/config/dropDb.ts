import mongoose, { mongo } from "mongoose";

export async function deleteDatabase(uri:any){
    try {
        await mongoose.connect(uri)
        await mongoose.connection.dropDatabase();
        console.log("Databse dropped")
        process.exit(0)
    } catch (error) {
        console.log(error)        
    }finally{
        await mongoose.connection.close()
    }
}