import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./QueueGroupName";
import {
  BaseListener,
  SUBJECTS,
  TicketUpdateEvent,
} from "@vsticketing012/common";
import { TicketModel } from "../../models/tickets";

export class TicketUpdateListener extends BaseListener<TicketUpdateEvent> {
  channelName: SUBJECTS.TICKET_UPDATE = SUBJECTS.TICKET_UPDATE;
  queueGroupName = QueueGroupName;

  async onMessage(data: TicketUpdateEvent["data"], msg: Message) {
    const { price, title, version } = data;

    const ticket = await TicketModel.findByEvent(data);
    if (!ticket) {
      throw new Error("ticket is not found");
    }
    // console.log(id);
    ticket.set({ title, price, version });
    await ticket.save();
    msg.ack();
  }
}
