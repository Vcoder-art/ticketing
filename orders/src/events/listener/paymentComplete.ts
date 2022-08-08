import {
  paymentCreateEvent,
  BaseListener,
  SUBJECTS,
  OrderStatus,
} from "@vsticketing012/common";
import { Message } from "node-nats-streaming";
import { OrderModel } from "../../models/order";
import { QueueGroupName } from "./QueueGroupName";

export class Paymentlistener extends BaseListener<paymentCreateEvent> {
  channelName: SUBJECTS.PAYMENT = SUBJECTS.PAYMENT;
  queueGroupName = QueueGroupName;
  async onMessage(
    data: { orderID: string; stripeID: string; id: string },
    msg: Message
  ) {
    const order = await OrderModel.findById(data.orderID);

    if (!order) {
      throw new Error("order is not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
