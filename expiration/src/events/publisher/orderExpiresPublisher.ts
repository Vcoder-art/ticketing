import {
  ExpirationEvent,
  SUBJECTS,
  BasePublisher,
} from "@vsticketing012/common";

export class OrderExpiresPublisher extends BasePublisher<ExpirationEvent> {
  channelName: SUBJECTS.EXPIRATION = SUBJECTS.EXPIRATION;
}
