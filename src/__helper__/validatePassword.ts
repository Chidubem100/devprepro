import { BadRequestApiError } from "../errors";

function isPasswordStrong(val:string):Boolean{
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    if(val.length < 8){
        throw new BadRequestApiError("Password must be at least 8 characters", 400)
    }

    const hasUpperCase = upperCaseRegex.test(val);
    const hasLowerCase = lowerCaseRegex.test(val);
    const hasNumber = numberRegex.test(val);
    const hasSpecialChar = specialCharRegex.test(val);

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}


export default isPasswordStrong;