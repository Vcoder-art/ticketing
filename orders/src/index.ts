import mongoose from "mongoose";
import { app } from "./app";
import { nats } from "./natsWrapper";
import { TicketCreateListener } from "./events/listener/ticketCreateListener";
import { TicketUpdateListener } from "./events/listener/ticketUpdateListener";
import { OrderExpiresListener } from "./events/listener/orderExpiresListener";
import { Paymentlistener } from "./events/listener/paymentComplete";

const start = async () => {
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

    new TicketCreateListener(nats.getClient).listen();
    new TicketUpdateListener(nats.getClient).listen();
    new OrderExpiresListener(nats.getClient).listen();
    new Paymentlistener(nats.getClient).listen();
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
