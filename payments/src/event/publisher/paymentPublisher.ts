import {
  paymentCreateEvent,
  BasePublisher,
  SUBJECTS,
} from "@vsticketing012/common";

export class PaymentPublisher extends BasePublisher<paymentCreateEvent> {
  channelName: SUBJECTS.PAYMENT = SUBJECTS.PAYMENT;
}
