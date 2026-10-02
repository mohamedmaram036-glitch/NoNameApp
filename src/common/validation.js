import {z} from "zod";
import { GenderEnum } from "./enum/user.gender.js";
import { LanguageEnum } from "./enum/security.enum.js";

const matchField = ({original, copy , data ,ctx , lang})=>{
    if (data[original] != data[copy]) {
        ctx.addIssue({
            code:"custom",
            path:[copy],
            message:lang == LanguageEnum.AR ? `فشل المطابقة بين ${original} و ${copy}` : `fail to match between ${original} and ${copy}`
        })
    }
}

export const generalValidationField = {
    email:(lang) => z.email({message:"invalid email format please add valid email like example@example.com"}),
    // otp:(lang) => z.string().regex(/^\d{6}$/, {message: "OTP must be a 6-digit number"}),
    password: (lang) => z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#_$%^&*()])[A-Za-z\d!@#_$%^&*()]{8,16}$/,
    {message: "Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"}
).min(8).max(16),
    username:(lang) => z.string().min(2 , {message: lang == LanguageEnum.AR ? "اسم المستخدم يجب أن يكون بطول 2 حرف على الأقل" : "username must be at least 2 characters long"}),
    phone:(lang) => z.e164(),
    matchField
}