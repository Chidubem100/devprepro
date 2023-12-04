import CustomApiErrors from "./customErrors";


class BadRequestApiError extends CustomApiErrors{
    constructor(
        public message: string, 
        public statusCode: number
    ){
        super(message)
        this.statusCode = 400;
    }
}

export default BadRequestApiError;
