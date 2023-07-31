import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import todoRoute from "./routes/TodoRoute.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connDB from "./config/connDB.js";
dotenv.config();
connDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 8080;

app.use("/api/users", userRoute);
app.use("/api/todos", todoRoute);

app.use(notFound);
app.use(errorHandler);

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
});
