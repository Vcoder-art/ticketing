import mongoose from "mongoose";
import { OrderModel } from "../../../models/order";
import { TicketModel } from "../../../models/tickets";
import { OrderStatus, ExpirationEvent } from "@vsticketing012/common";
import { OrderExpiresListener } from "../orderExpiresListener";
import { nats } from "../../../natsWrapper";
import { Message } from "node-nats-streaming";
const setup = async () => {
  // create a ticket

  const ticket = TicketModel.build({
    title: "conert",
    price: 454,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // create a order

  const order = OrderModel.build({
    userID: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  //create order Expired listener object

  const listener = new OrderExpiresListener(nats.getClient);

  // create fake Message object

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // create fake data object

  const data: ExpirationEvent["data"] = {
    orderID: order.id,
  };

  return { listener, data, msg, order };
};

it("sucessfully changed the order status", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);
  const updateOrder = await OrderModel.findById(order.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("check publish the order cancel event", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const paraMeterData = JSON.parse(
    (nats.getClient.publish as jest.Mock).mock.calls[0][1]
  );
  expect(paraMeterData.id).toEqual(order.id);
});

it("check ack function have called", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  expect(nats.getClient.publish).toHaveBeenCalled();
});
