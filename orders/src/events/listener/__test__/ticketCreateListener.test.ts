import { TicketCreateListener } from "../ticketCreateListener";
import { TicketCreateEvent } from "@vsticketing012/common";
import { nats } from "../../../natsWrapper";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketModel } from "../../../models/tickets";

const setup = async () => {
  //create a an object of TicketCreateListener
  const listener = new TicketCreateListener(nats.getClient);

  // fake data event object
  const data: TicketCreateEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 3434,
    userID: new mongoose.Types.ObjectId().toHexString(),
  };

  // fake message object with the ack function

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("ticket create listener create and saves ticket", async () => {
  // call the onMessage function with fake data event and Message object
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticket = await TicketModel.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.id).toEqual(data.id);
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);

  //"ack function should be called"
  expect(msg.ack).toHaveBeenCalled();

  // write assertion to ticket is saved or created
});
