import express from "express";
import {
  authenticationController,
  messageController,
  userController,
} from "./modules/index.js";
import { globalErrorHandling } from "./middleware/error.middleware.js";
import { bootstrapDB } from "./DB/connection.db.js";
import { PORT } from "./config.js";
const app = express();
bootstrapDB (app , PORT)
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

