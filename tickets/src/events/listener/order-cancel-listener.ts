import {
  BaseListener,
  NotFoundError,
  orderCancelEvent,
  SUBJECTS,
} from "@vsticketing012/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupNames";
import { Ticket } from "../../model/ticket";
import { TicketUpdatePublisher } from "../publisher/TicketUpdatePublisher";

export class OrderCancelListener extends BaseListener<orderCancelEvent> {
  channelName: SUBJECTS.ORDER_CANCEL = SUBJECTS.ORDER_CANCEL;
  queueGroupName = queueGroupName;

  async onMessage(data: orderCancelEvent["data"], msg: Message): Promise<void> {
    // fetch ticket into the database
    const ticket = await Ticket.findById(data.ticket.id);

    // check ticket is exist or not
    if (!ticket) {
      throw new NotFoundError();
    }

    // set the orderId to null
    ticket.set({ orderId: undefined });

    //save into the database
    await ticket.save();

    // publish the new version of the ticket

    const pub = new TicketUpdatePublisher(this.client);
    pub.publisher({
      version: ticket.version,
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userID: ticket.userId,
      orderID: ticket.orderId,
    });

    msg.ack();
  }
}
