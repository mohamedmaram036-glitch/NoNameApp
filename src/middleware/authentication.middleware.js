import { TokenTypeEnum } from "../common/enum/security.enum.js";
import {
  ForbiddenExceptions,
  UnauthorizedExceptions,
} from "../common/exceptions/error.exceptions.js";
import { basicAuth, decodeToken } from "../common/security/token.security.js";

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    console.log({ authorization });

    if (!authorization) {
      throw UnauthorizedExceptions("Unauthorized account");
    }
    const [key, credential] = authorization.split(" ") || [];
    console.log({ key, credential });
    

    switch (key) {
      case "Basic":
        const [email , password] = Buffer.from(credential, "base64").toString()?.split(":") || [];
        console.log({ email, password });
        req.user = await basicAuth({ email, password });
        break;
      case "Bearer":
        const { user, payload } = await decodeToken({
          authorization: credential,
          tokenType,
        });
        req.user = user;
        req.payload = payload;
        break;

      default:
        next(
          new Error("invalid authentication schema", {
            cause: { status: 400 },
          }),
        );
        break;
    }

    next();
  };
};

export const authorization = (accessRole) => {
  return async (req, res, next) => {
    if (req.user.role < accessRole) {
      throw ForbiddenExceptions("Forbidden account");
    }

    next();
  };
};

// export const authorization = (accessRoles , bylevel = true)=>{
//     return async (req , res , next)=>{
//         switch (bylevel) {
//             case true:
//                     if(req.user.role < accessRoles){
//                         throw ForbiddenExceptions("Forbidden account")
//                     }

//                 break;

//             default:
//                 if(!accessRoles.includes(req.user.role)){
//                     throw ForbiddenExceptions("Forbidden account")
//                 }
//                 break;
//         }

//     if(!accessRoles.includes(req.user.role)){
//         throw ForbiddenExceptions("Forbidden account")
//     }

//     next()
// }
// }
