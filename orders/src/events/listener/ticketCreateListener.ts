import {
  BaseListener,
  SUBJECTS,
  TicketCreateEvent,
} from "@vsticketing012/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./QueueGroupName";
import { TicketModel } from "../../models/tickets";

export class TicketCreateListener extends BaseListener<TicketCreateEvent> {
  channelName: SUBJECTS.TICKET_CREATE = SUBJECTS.TICKET_CREATE;
  queueGroupName = QueueGroupName;

  async onMessage(data: TicketCreateEvent["data"], msg: Message) {
    const ticket = TicketModel.build({
      title: data.title,
      price: data.price,
      id: data.id,
    });
    await ticket.save();
    msg.ack();
  }
}
