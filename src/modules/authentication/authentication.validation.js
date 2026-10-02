import {z} from "zod";
import { GenderEnum } from "../../common/enum/user.gender.js";
import { generalValidationField } from "../../common/validation.js";




export const loginSchema = (lang)=>{
    return z.strictObject({
    email:generalValidationField.email(lang),
    password: generalValidationField.password(lang),
})
}

export const login = (lang)=>{
    return z.object({
    body: loginSchema(lang)
    })
}



export const signup = (lang)=>{
    return z.object({
    body:loginSchema(lang).safeExtend({
    username: generalValidationField.username(lang),
    phone: generalValidationField.phone(lang),
    confirmpassword: generalValidationField.password(lang),
    // otp: generalValidationField.otp(lang)
}).superRefine((data , ctx)=>{
    console.log({data , ctx});

    generalValidationField.matchField({original:"password" , copy:"confirmpassword" , data , ctx , lang})
    
    if (!data.username.includes(" ")) {
        ctx.addIssue({
            code:"custom",
            path:['username'],
            message:"username must contain 2 parts"
        })
    }
    
})
})

}


