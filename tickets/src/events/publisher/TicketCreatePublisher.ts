import {
  BasePublisher,
  TicketCreateEvent,
  SUBJECTS,
} from "@vsticketing012/common";

export class TicketCreatePublisher extends BasePublisher<TicketCreateEvent> {
  channelName: SUBJECTS.TICKET_CREATE = SUBJECTS.TICKET_CREATE;
}
