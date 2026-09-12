import { ConflictExceptions, NotfoundExceptions } from "../../common/exceptions/error.exceptions.js"
import { createOne, findOne } from "../../common/repository/index.js"
import { UserModel } from "../../DB/model/user.model.js"

export const signup = async({email ,password , username}) =>{
    const duplicatedAccount = await findOne({
        model:UserModel,
        filter:{email},
        options:{select:"email"}
    })
    if (duplicatedAccount) throw ConflictExceptions("Email Exist" , {lol:"dmnwi"})
    const account = await createOne({
        model:UserModel,
        data:{email ,password , username}
    })
    return account
}


export const login = async({email , password}) =>{
     const account = await findOne({
        model:UserModel,
        filter:{email , password},
        options:{select:"-password"}
    })
    if (!account) throw new NotfoundExceptions("not Exist" ,{cause:{status:404}})
    return account
}