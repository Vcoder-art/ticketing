import {
  BaseListener,
  SUBJECTS,
  orderCancelEvent,
  OrderStatus,
} from "@vsticketing012/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelListener extends BaseListener<orderCancelEvent> {
  channelName: SUBJECTS.ORDER_CANCEL = SUBJECTS.ORDER_CANCEL;
  queueGroupName = queueGroupName;

  async onMessage(data: orderCancelEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order not found yet");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
