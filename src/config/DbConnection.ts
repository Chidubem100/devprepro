import mongoose from 'mongoose';

const connectDB = async(uri:any) =>{
    try {
        await mongoose.connect(uri)
        console.log("Database connected successfully!")
    } catch (error) {
        console.log(error)   
    }
    
}
const disConnectDB = () =>{
    mongoose.disconnect()
}

export {connectDB,disConnectDB}