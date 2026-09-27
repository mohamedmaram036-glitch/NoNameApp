
import { findByIdAndUpdate } from "../../common/repository/base.repository.js";
import { UserModel } from '../../DB/model/user.model.js';
import { createLoginCredentials} from '../../common/security/token.security.js';
import { ACCESS_TOKEN_EXPIRES_IN } from '../../config.js';
import { ConflictExceptions } from '../../common/exceptions/error.exceptions.js';


export const profile = async(account)=>{
    return account
}


export const update = async(user , data)=>{
    
    const account = await findByIdAndUpdate({
        model:UserModel ,
        id:user._id,
        update: data
    })
    
    return account
}


export const rotateToken = async(payload , user , issuer)=>{
    
    const accsessExpireIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN)*1000
    const currentTime= Date.now()+(30*60000);
    if(currentTime < accsessExpireIn){
        throw ConflictExceptions("sorry we cannot create new login credentials while current access token still within valid time range")
    }


    return await createLoginCredentials({user , issuer})
}