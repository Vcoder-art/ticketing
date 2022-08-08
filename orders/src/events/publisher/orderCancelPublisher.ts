import {
  BasePublisher,
  orderCancelEvent,
  SUBJECTS,
} from "@vsticketing012/common";

export class OrderCancelPublisher extends BasePublisher<orderCancelEvent> {
  channelName: SUBJECTS.ORDER_CANCEL = SUBJECTS.ORDER_CANCEL;
}
