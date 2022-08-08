import { TicketUpdateListener } from "../ticketUpdateListener";
import { TicketUpdateEvent } from "@vsticketing012/common";
import mongoose from "mongoose";
import { nats } from "../../../natsWrapper";
import { Message } from "node-nats-streaming";
import { TicketModel } from "../../../models/tickets";

const setup = async () => {
  // create inctance of an TicketUpdateListner class
  const ticketUpdatelistener = new TicketUpdateListener(nats.getClient);

  //create fake document of ticket

  const ticket = TicketModel.build({
    title: "concert",
    price: 343,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // create fake data object

  const ticketUpdateData: TicketUpdateEvent["data"] = {
    id: ticket.id,
    userID: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    title: "husbend of coding",
    version: 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    ticketUpdateData,
    msg,
    ticketUpdatelistener,
  };
};

it("update ticket listener works sucessfully", async () => {
  const { ticketUpdateData, ticketUpdatelistener, msg } = await setup();

  await ticketUpdatelistener.onMessage(ticketUpdateData, msg);

  const ticket = await TicketModel.findById(ticketUpdateData.id);
  expect(ticket?.price).toEqual(ticketUpdateData.price);
  expect(ticket?.version).toEqual(ticketUpdateData.version);

  expect(msg.ack).toHaveBeenCalled();
});
