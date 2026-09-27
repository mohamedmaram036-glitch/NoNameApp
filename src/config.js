import { config } from "dotenv";
import {resolve} from 'node:path'
export const NODE_ENV = `.env.${process.env.NODE_ENV ?? 'development'}`
config({path:resolve(NODE_ENV)})
export const PORT = parseInt(process.env.PORT ?? "9000")


export const DB_URI = process.env.DB_URI
export const ENC_KEY = process.env.ENC_KEY
export const IV_LENGTH = parseInt(process.env.IV_LENGTH ?? "16")


export const ACCESS_ADMIN_TOKEN_SIGNTURE = process.env.ACCESS_ADMIN_TOKEN_SIGNTURE
export const ACCESS_USER_TOKEN_SIGNTURE = process.env.ACCESS_USER_TOKEN_SIGNTURE
export const REFREH_USER_TOKEN_SIGNTURE = process.env.REFREH_USER_TOKEN_SIGNTURE
export const REFREH_ADMIN_TOKEN_SIGNTURE = process.env.REFREH_ADMIN_TOKEN_SIGNTURE


export const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1800")
export const REFREH_TOKEN_EXPIRES_IN = parseInt(process.env.REFREH_TOKEN_EXPIRES_IN ?? "86400*365")


export const WEB_CLIENT_IDS = process.env.WEB_CLIENT_IDS.split(",")