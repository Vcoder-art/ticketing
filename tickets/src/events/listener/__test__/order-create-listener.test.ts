import { Ticket } from "../../../model/ticket";
import mongoose from "mongoose";
import { OrderCreateListener } from "../order-create-listener";
import { nats } from "../../../natsWrapper";
import { orderCreateEvent, OrderStatus } from "@vsticketing012/common";
import { Message } from "node-nats-streaming";

async function setup() {
  // create some existing ticket

  const saveTicket = Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 454,
  });

  await saveTicket.save();

  // create intance of  orderCreateListener

  const listener = new OrderCreateListener(nats.getClient);

  // create fake data event object

  const data: orderCreateEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userID: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "expiresMe",
    ticket: {
      id: saveTicket.id,
      price: saveTicket.price,
    },
  };

  // Create fake message object with ack function

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
}

it("check the order create listener works properly", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.ticket.id);

  console.log(ticket);
  expect(ticket?.orderId).toEqual(data.id);
  expect(msg.ack).toHaveBeenCalled();
});

it("publish ticket update event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // const ticket = await Ticket.findById(data.ticket.id);

  // console.log(ticket);
  // expect(ticket?.orderId).toEqual(data.id);
  // expect(msg.ack).toHaveBeenCalled();

  console.log(nats.getClient.publish);
  expect(nats.getClient.publish).toHaveBeenCalled();

  console.log((nats.getClient.publish as jest.Mock).mock.calls);
  const parameterData = JSON.parse(
    (nats.getClient.publish as jest.Mock).mock.calls[0][1]
  );

  console.log(parameterData);
  expect(parameterData.orderID).toEqual(data.id);
});
