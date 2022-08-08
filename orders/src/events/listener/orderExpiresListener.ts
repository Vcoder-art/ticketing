import {
  SUBJECTS,
  BaseListener,
  ExpirationEvent,
  OrderStatus,
} from "@vsticketing012/common";
import { QueueGroupName } from "./QueueGroupName";
import { Message } from "node-nats-streaming";
import { OrderCancelPublisher } from "../publisher/orderCancelPublisher";
import { OrderModel } from "../../models/order";

export class OrderExpiresListener extends BaseListener<ExpirationEvent> {
  channelName: SUBJECTS.EXPIRATION = SUBJECTS.EXPIRATION;
  queueGroupName = QueueGroupName;

  async onMessage(data: ExpirationEvent["data"], msg: Message) {
    const order = await OrderModel.findById(data.orderID).populate("ticket");

    if (!order) {
      throw new Error("order not found");
    }
    console.log(order.status);
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelPublisher(this.client).publisher({
      version: order.version,
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
