import {
  BasePublisher,
  orderCreateEvent,
  SUBJECTS,
} from "@vsticketing012/common";

export class OrderCreatePublisher extends BasePublisher<orderCreateEvent> {
  channelName: SUBJECTS.ORDER_CREATE = SUBJECTS.ORDER_CREATE;
}
