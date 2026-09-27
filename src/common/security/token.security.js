import jwt from "jsonwebtoken";
import {
  ACCESS_ADMIN_TOKEN_SIGNTURE,
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_USER_TOKEN_SIGNTURE,
  REFREH_ADMIN_TOKEN_SIGNTURE,
  REFREH_TOKEN_EXPIRES_IN,
  REFREH_USER_TOKEN_SIGNTURE,
} from "../../config.js";
import {
  BadExceptions,
  NotfoundExceptions,
} from "../exceptions/error.exceptions.js";
import { findById, findOne } from "../repository/base.repository.js";
import { UserModel } from "./../../DB/model/user.model.js";
import { TokenTypeEnum } from "../enum/security.enum.js";
import { RoleEnum } from "../enum/user.gender.js";
import { compare } from "./hash.security.js";

export const createToken = async ({
  payload = {},
  options = {},
  secret = ACCESS_USER_TOKEN_SIGNTURE,
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = "",
  secret = ACCESS_USER_TOKEN_SIGNTURE,
} = {}) => {
  return jwt.verify(token, secret);
};

const getTokenSignatures = async ({ role = RoleEnum.USER } = {}) => {
  let signatures;
  switch (role) {
    case RoleEnum.ADMIN:
      signatures = {
        accessSignature: ACCESS_ADMIN_TOKEN_SIGNTURE,
        refrehSignature: REFREH_ADMIN_TOKEN_SIGNTURE,
      };

      break;

    default:
      signatures = {
        accessSignature: ACCESS_USER_TOKEN_SIGNTURE,
        refrehSignature: REFREH_USER_TOKEN_SIGNTURE,
      };
      break;
  }
  return signatures;
};

const getSignature = async ({
  tokenType = TokenTypeEnum.ACCESS,
  role = RoleEnum.USER,
} = {}) => {
  const signatures = await getTokenSignatures({ role });
  return tokenType == TokenTypeEnum.ACCESS
    ? signatures.accessSignature
    : signatures.refrehSignature;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = TokenTypeEnum.ACCESS,
} = {}) => {
  const decoded = jwt.decode(authorization);
  console.log(decoded);
  if (!decoded?.aud?.length) {
    throw BadExceptions("missing token payload");
  }

  const payload = await verifyToken({
    token: authorization,
    secret: await getSignature({ tokenType, role: decoded.aud[0] }),
  });
  if (!payload?.sub) {
    throw BadExceptions("missing token payload");
  }
  const user = await findById({
    model: UserModel,
    id: payload.sub,
  });
  if (!user) {
    throw NotfoundExceptions("invalid user");
  }
  return { user, payload };
};

export const createLoginCredentials = async ({
  user,
  issuer,
  options = {},
}) => {
  const { accessSignature, refrehSignature } = await getTokenSignatures({
    role: user.role,
  });
  const access_token = await createToken({
    payload: { sub: user._id },
    secret: accessSignature,
    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });

  const refreh_token = await createToken({
    payload: { sub: user._id },
    secret: refrehSignature,
    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: REFREH_TOKEN_EXPIRES_IN,
    },
    secret: refrehSignature,
  });

  console.log({ accessSignature, refrehSignature });

  return { access_token, refreh_token };
};

export const basicAuth = async({email , password }) =>{
     const account = await findOne({
        model:UserModel,
        filter:{email},
    })
    if (!account) throw NotfoundExceptions("not Exist" ,{cause:{status:404}})
    const match = await compare(password , account.password)
    


    if (!match) throw NotfoundExceptions("not Exist" ,{cause:{status:404}})

       
        return account
}