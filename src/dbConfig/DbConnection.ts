import mongoose from 'mongoose';


const connectDB = async(uri:any) =>{
    try {
        await mongoose.connect(uri)
        console.log('database connected')
    } catch (error) {
        console.log(error)   
    }
    
}
const disConnectDB = () =>{
    mongoose.disconnect()
}

export {connectDB,disConnectDB}