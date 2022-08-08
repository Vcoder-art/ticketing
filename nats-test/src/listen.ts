import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreateListener } from "./events/TicketCreateListener";
import { TicketUpdateListener } from "./events/TicketUpdateListener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "https://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener is connected");

  new TicketCreateListener(stan).listen();
});
