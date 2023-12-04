import CustomApiErrors from "./customErrors";

class NotFoundApiError extends CustomApiErrors{
    constructor(
        public message: string,
        public statusCode: number
    ){
        super(message)
        this.statusCode = 404;
    }
}

export default NotFoundApiError;