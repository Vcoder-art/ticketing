import Queue from "bull";
import { OrderExpiresPublisher } from "./events/publisher/orderExpiresPublisher";
import { nats } from "./natsWrapper";

interface payload {
  orderID: string;
}

const expirationQueue = new Queue<payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  // console.log("publish the event", job.data.orderID);
  await new OrderExpiresPublisher(nats.getClient).publisher({
    orderID: job.data.orderID,
  });
});

export { expirationQueue };
