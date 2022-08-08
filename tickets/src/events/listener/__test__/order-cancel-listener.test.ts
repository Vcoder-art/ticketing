import { Ticket } from "../../../model/ticket";
import { OrderCancelListener } from "../order-cancel-listener";
import { nats } from "../../../natsWrapper";
import { orderCancelEvent } from "@vsticketing012/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create a OrderCancelListener instance

  const listener = new OrderCancelListener(nats.getClient);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  //create a ticket object
  const ticket = Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 3434,
  });

  ticket.set({ orderId });
  await ticket.save();

  // fake data object

  const data: orderCancelEvent["data"] = {
    version: 2,
    id: orderId,
    ticket: {
      id: ticket.id,
    },
  };

  //fake message Object

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("its unreserved the ticket sucessfully", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toEqual(data.id);
  expect(msg.ack).toHaveBeenCalled();
});

it("publish the ticket update event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(nats.getClient.publish).toHaveBeenCalled();
});
