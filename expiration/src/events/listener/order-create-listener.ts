import {
  BaseListener,
  orderCreateEvent,
  SUBJECTS,
} from "@vsticketing012/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../expiration-queue";

export class OrderCreateListener extends BaseListener<orderCreateEvent> {
  channelName: SUBJECTS.ORDER_CREATE = SUBJECTS.ORDER_CREATE;
  queueGroupName = queueGroupName;
  async onMessage(data: orderCreateEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("this is the time to delay: " + delay);
    expirationQueue.add(
      {
        orderID: data.id,
      },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}
