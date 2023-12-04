import mongoose from 'mongoose';
import log from '../../config/logger';

const connectDB = async(uri:any) =>{
    try {
        await mongoose.connect(uri)
        log.info('Database connected')
    } catch (error) {
        log.warn('Database Error occurred')
        console.log(error)   
    }
    
}
const disConnectDB = () =>{
    mongoose.disconnect()
}

export {connectDB,disConnectDB}