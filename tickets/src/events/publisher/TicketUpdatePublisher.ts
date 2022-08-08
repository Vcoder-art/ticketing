import {
  SUBJECTS,
  TicketUpdateEvent,
  BasePublisher,
} from "@vsticketing012/common";

export class TicketUpdatePublisher extends BasePublisher<TicketUpdateEvent> {
  channelName: SUBJECTS.TICKET_UPDATE = SUBJECTS.TICKET_UPDATE;
}
