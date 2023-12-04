import CustomApiErrors from "./customErrors";

class UnauthorizedApiError extends CustomApiErrors{
    constructor(
        public message: string,
        public statuscode: number
    ){
        super(message)
        this.statuscode = 403;
    }
}


export default UnauthorizedApiError;