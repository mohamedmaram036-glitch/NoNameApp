import express from "express";
import {
  authenticationController,
  messageController,
  userController,
} from "./modules/index.js";
import { globalErrorHandling } from "./middleware/error.middleware.js";
import { bootstrapDB } from "./DB/connection.db.js";
import { PORT } from "./config.js";
import cors from 'cors';
import { client } from "./DB/redis.connection.js";
import { del, exist, get, keys, set, update } from "./common/services/index.js";
const app = express();
app.use(cors());


await bootstrapDB (app , PORT)


// await set({ key: "userGender", value:{type: "female"} });
// await set({ key: "userAge", value:{type: 21} });
// console.log(
//   await del({ key:await keys({ prefix: "user" })})
// );





const port = 3000;
app.use(express.json());
app.all("/", (req, res) =>
  res.status(200).send({ message: "Welcome to BE API" }),
);
app.use("/auth", authenticationController);
app.use("/message", messageController);
app.use("/user", userController);
app.all("{/*dummy}", (req, res) =>
  res.status(404).send({ message: "Invalid application routing" }),
);
app.use(globalErrorHandling);

