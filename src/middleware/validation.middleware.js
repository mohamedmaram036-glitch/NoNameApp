
import { LanguageEnum } from "../common/enum/security.enum.js"
import { BadExceptions } from "../common/exceptions/error.exceptions.js"




export const validation = (Schema) =>{
    return (req , res , next)=>{
        const lang = Number(req.headers['accept-language'] ?? LanguageEnum.EN);
        console.log({lang});
        
        const validationResult = Schema(lang).safeParse({
            body:req.body,
            query:req.query,
            params:req.params,

        })
        if(!validationResult.success){
            throw BadExceptions("validation error" , validationResult.error.issues)
        }
        req.validate = validationResult.data
        next()
    }
}