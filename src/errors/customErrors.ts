class CustomApiErrors extends Error{
    constructor(
        public message:string
    ){
        super(message)
    }
}

export default CustomApiErrors;