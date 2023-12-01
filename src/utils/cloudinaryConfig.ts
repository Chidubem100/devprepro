import cloudinaryy from 'cloudinary';
import multer,{FileFilterCallback} from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import fastify, {FastifyReply,FastifyRequest} from 'fastify'

const Cloudinary = cloudinaryy.v2;

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename:string) => void;


Cloudinary.config({
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRETE,
    api_name: process.env.CLOUD_NAME
});

const storage = new CloudinaryStorage({
    cloudinary:Cloudinary,
    params:async (request, file) => {
        return {
            folder: 'Devprepro',
            format: 'jpeg'
        }
    }

});

const uploader = multer({storage: storage});


export {uploader}