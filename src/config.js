import { config } from "dotenv";
import {resolve} from 'node:path'
export const NODE_ENV = `.env.${process.env.NODE_ENV ?? 'development'}`
config({path:resolve(NODE_ENV)})
export const PORT = parseInt(process.env.PORT ?? "9000")


export const DB_URI=process.env.DB_URI
