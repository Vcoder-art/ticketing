import { orderCancelEvent, OrderStatus } from "@vsticketing012/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelListener } from "../orderCancelListener";
import { nats } from "../../../natsWrapper";
import { Order } from "../../../models/order";

const setup = async () => {
  const order = Order.build({
    userID: "lhgkdgfkjg",
    price: 223,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();
  // create fake order data

  const data: orderCancelEvent["data"] = {
    version: 1,
    id: order.id,
    ticket: {
      id: "vhfhvdfh",
    },
  };

  // create msg

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // create listener

  const listener = new OrderCancelListener(nats.getClient);

  return { listener, data, msg, order };
};

it("check the order can build sucessfully", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(data.id);
  console.log(updatedOrder);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});
