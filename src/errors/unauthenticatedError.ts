import CustomApiErrors from "./customErrors";

class UnauthenticatedApiError extends CustomApiErrors{
    constructor(
        public message : string,
        public statusCode: number
    ){
        super(message)
        this.statusCode = 401
    }
}


export default UnauthenticatedApiError;