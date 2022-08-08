import {
  BaseListener,
  SUBJECTS,
  orderCreateEvent,
} from "@vsticketing012/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreateListener extends BaseListener<orderCreateEvent> {
  channelName: SUBJECTS.ORDER_CREATE = SUBJECTS.ORDER_CREATE;
  queueGroupName = queueGroupName;
  async onMessage(data: orderCreateEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      userID: data.userID,
      status: data.status,
      price: data.ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
