import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("this is a auth")
  if (!process.env.JWT_SECRET) {
    throw new Error("enviroment variable is not load");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("enviroment variable is not load");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("data base is connected");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("server is started and we have!! swami!");
  });
};

start();
