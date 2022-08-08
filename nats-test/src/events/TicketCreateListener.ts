import { Stan, Message } from "node-nats-streaming";
import { BaseListener } from "@vsticketing012/common";
import { TicketCreateEvent } from "@vsticketing012/common";
import { SUBJECTS } from "@vsticketing012/common";

export class TicketCreateListener extends BaseListener<TicketCreateEvent> {
  channelName: SUBJECTS.TICKET_CREATE = SUBJECTS.TICKET_CREATE;
  queueGroupName = "payment-service";

  constructor(stan: Stan) {
    super(stan);
  }

  onMessage(data: TicketCreateEvent["data"], msg: Message): void {
    console.log(data);
  }
}
