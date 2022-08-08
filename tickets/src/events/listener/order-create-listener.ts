import {
  BaseListener,
  SUBJECTS,
  orderCreateEvent,
  NotFoundError,
} from "@vsticketing012/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupNames";
import { Ticket } from "../../model/ticket";
import { TicketUpdatePublisher } from "../publisher/TicketUpdatePublisher";

export class OrderCreateListener extends BaseListener<orderCreateEvent> {
  channelName: SUBJECTS.ORDER_CREATE = SUBJECTS.ORDER_CREATE;
  queueGroupName = queueGroupName;

  async onMessage(data: orderCreateEvent["data"], msg: Message) {
    // found ticket in database that exist

    const ticket = await Ticket.findById(data.ticket.id);

    // check if the ticket exists

    if (!ticket) {
      throw new NotFoundError();
    }

    // update the order id property of the ticket

    ticket.set({ orderId: data.id });

    //save the ticket to the database
    await ticket.save();

    // publish data event

    const publisher = new TicketUpdatePublisher(this.client);
    await publisher.publisher({
      version: ticket.version,
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userID: ticket.userId,
      orderID: ticket.orderId,
    });

    //ack the message event

    msg.ack();
  }
}
