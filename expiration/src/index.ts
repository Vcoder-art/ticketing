import { nats } from "./natsWrapper";
import { OrderCreateListener } from "./events/listener/order-create-listener";

const start = async () => {
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

    new OrderCreateListener(nats.getClient).listen();
    // console.log("expiration service nats connected");
  } catch (e) {
    console.log(e);
  }
};

start();
