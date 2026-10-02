import { BadExceptions, ConflictExceptions, NotfoundExceptions } from "../../common/exceptions/error.exceptions.js"
import { createOne, findOne } from "../../common/repository/index.js"
import { UserModel } from "../../DB/model/user.model.js"
import { compare, createLoginCredentials, hash } from "../../common/security/index.js"
import { encryption } from "../../common/security/encryption.security.js"
import { WEB_CLIENT_IDS } from "../../config.js"
import {OAuth2Client} from 'google-auth-library';
import { ProviderEnum } from "../../common/enum/user.gender.js"


/*

{
  payload: {
    iss: 'https://accounts.google.com',
    azp: '935208346597-f95o1qqvfsaa2mrhdtss1m46jioovk02.apps.googleusercontent.com',
    aud: '935208346597-f95o1qqvfsaa2mrhdtss1m46jioovk02.apps.googleusercontent.com',
    sub: '112833451405625482662',
    email: 'mohamedmaram036@gmail.com',
    email_verified: true,
    nonce: 'not_provided',
    nbf: 1790516105,
    name: 'Maram Mohamed',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocKYdYrC10kDxc6v__m1xlRizf9IcYYdE0Wa1a06avHcTkcaDA=s96-c',
    given_name: 'Maram',
    family_name: 'Mohamed',
    iat: 1790516405,
    exp: 1790520005,
    jti: '9809204084cffc96a34c937481300dd73b887eaa'
  }
}

*/

const client = new OAuth2Client();

async function verifyGoogleAccount(idToken) {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: WEB_CLIENT_IDS,  
    });
    const payload = ticket.getPayload();
    if(!payload.email_verified){
        throw BadExceptions("email not verified")
    }
    return payload;

}



// export const loginWithGmail = async({account ,issuer}) =>{
//         return await createLoginCredentials({user:account , issuer})
// }




export const signupWithGmail = async({idToken} , issuer) =>{
    console.log({idToken});
    const {name , email , picture} = await verifyGoogleAccount(idToken);
    console.log({name , email , picture});
    const existAccount = await findOne({
        model:UserModel,
        filter:{email},
    })
    if (existAccount) {
        if (existAccount.Provider != ProviderEnum.GOOGLE) {
            throw ConflictExceptions("invalid account provider")
        }
        return {status:200 ,data:await createLoginCredentials({user:existAccount , issuer})}
    }
    const user = await createOne({
        model:UserModel,
        data:{
            username:name,
            email,
            confirmEmail: new Date(),
            Provider: ProviderEnum.GOOGLE,
            image: picture
        }
    })
    return{status:201 ,data:await createLoginCredentials({user , issuer})}
}


export const signup = async({email ,password , username , phone}) =>{
    const duplicatedAccount = await findOne({
        model:UserModel,
        filter:{email},
        options:{select:"email"}
    })
    if (duplicatedAccount) throw ConflictExceptions("Email Exist")

    const account = await createOne({
        model:UserModel,
        data:{
            email,
            password:await hash(password),
            phone:await encryption(phone),
            username

        }
    })
    return account
}


export const login = async({email , password },issuer) =>{
     const account = await findOne({
        model:UserModel,
        filter:{email , Provider:ProviderEnum.SYSTEM},
    })
    if (!account) throw NotfoundExceptions("not Exist" ,{cause:{status:404}})
    const match = await compare(password , account.password)
    console.log({password,hash:account.password , match});


    if (!match) throw NotfoundExceptions("not Exist" ,{cause:{status:404}})

       
        return await createLoginCredentials({user:account , issuer})
}