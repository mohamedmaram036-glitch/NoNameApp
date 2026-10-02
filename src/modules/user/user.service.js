
import { findByIdAndUpdate } from "../../common/repository/base.repository.js";
import { UserModel } from '../../DB/model/user.model.js';
import { createLoginCredentials, createRevokeToken, userBaseRevokeTokenKey, userRevokeTokenKey} from '../../common/security/token.security.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFREH_TOKEN_EXPIRES_IN } from '../../config.js';
import { ConflictExceptions } from '../../common/exceptions/error.exceptions.js';
import { del, keys, set } from "../../common/services/index.js";
import { LogoutEnum } from "../../common/enum/security.enum.js";


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


    const data = await createLoginCredentials({user , issuer});
    await createRevokeToken({payload});
    return data
} 


export const logout = async(payload , user , {action = LogoutEnum.DEVICE})=>{
    console.log({user});
    
    switch (action) {
        case LogoutEnum.ALL:
            user.changeCredentialsTime = new Date();
            await user.save();
            console.log({k:await keys({perfix:userBaseRevokeTokenKey({userId:payload.sub}) })});
            
            await del({key :await keys({perfix:userBaseRevokeTokenKey({userId:payload.sub}) }) })
            break;
    
        default:
            await createRevokeToken({payload})
            break;
    }
   return 
} 
