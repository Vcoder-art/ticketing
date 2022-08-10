import mongoose from "mongoose";
import { app } from "./app";
import { nats } from "./natsWrapper";
import { OrderCreateListener } from "./events/listener/order-create-listener";
import { OrderCancelListener } from "./events/listener/order-cancel-listener";

const start = async () => {
  console.log("ok fully baby");
  if (!process.env.JWT_SECRET) {
    throw new Error("enviroment variable is not load");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("enviroment variable is not load");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID variable is not load");
  }
  if (!process.env.NATS_CONNECTING_URL) {
    throw new Error("NATS_CONNECTING_URL variable is not load");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID variable is not load");
  }

  try {
    await nats.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_CONNECTING_URL
    );
    process.on("SIGINT", () => {
      console.log("sigint");
      nats.getClient.close();
    });
    process.on("SIGTERM", () => {
      console.log("sigterm");
      nats.getClient.close();
    });

    new OrderCreateListener(nats.getClient).listen();
    new OrderCancelListener(nats.getClient).listen();
  } catch (e) {
    console.log(e);
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
