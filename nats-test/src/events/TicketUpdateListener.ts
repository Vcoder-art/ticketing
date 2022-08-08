import { Stan, Message } from "node-nats-streaming";
import { BaseListener } from "@vsticketing012/common";
import { TicketUpdateEvent } from "@vsticketing012/common";
import { SUBJECTS } from "@vsticketing012/common";

export class TicketUpdateListener extends BaseListener<TicketUpdateEvent> {
  channelName: SUBJECTS.TICKET_UPDATE = SUBJECTS.TICKET_UPDATE;
  queueGroupName = "orders";

  constructor(stan: Stan) {
    super(stan);
  }

  onMessage(data: TicketUpdateEvent["data"], msg: Message): void {
    console.log(data);
    msg.ack();
  }
}
