import { orderCreateEvent, OrderStatus } from "@vsticketing012/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreateListener } from "../orderCreateListener";
import { nats } from "../../../natsWrapper";
import { Order } from "../../../models/order";
const setup = async () => {
  // create fake order data

  const data: orderCreateEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userID: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "blakiofh",
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 344,
    },
  };

  // create msg

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // create listener

  const listener = new OrderCreateListener(nats.getClient);

  return { listener, data, msg };
};

it("check the order can build sucessfully", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  console.log(order);
  expect(order!.id).toEqual(data.id);
});
