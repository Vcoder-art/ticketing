import { BasePublisher } from "@vsticketing012/common";
import { SUBJECTS } from "@vsticketing012/common";
import { TicketCreateEvent } from "@vsticketing012/common";

export class TicketCreatePublisher extends BasePublisher<TicketCreateEvent> {
  channelName: SUBJECTS.TICKET_CREATE = SUBJECTS.TICKET_CREATE;
}
