import nats from "node-nats-streaming";
import { TicketCreatePublisher } from "./events/TicketCreatePublisher";

const stan = nats.connect("ticketing", "abc", {
  url: "https://localhost:30450",
});

stan.on("connect", async () => {
  console.log("iam connected");
  const publisher = new TicketCreatePublisher(stan);

  await publisher.publisher({
    id: "12fwerf3456",
    title: "we are coders",
    price: 300,
    userID: "hjgvuvggvkgv",
  });

  // const data = JSON.stringify({
  //   title: "concert",
  //   price: 787,
  //   userId: "87877",
  // });

  // stan.publish("ticket:create", data, () => {
  //   console.log("publish  data successfully");
  // });
});
