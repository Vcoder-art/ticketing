import Request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getCookie } from "../../test/getCookie";
import { OrderModel, OrderStatus } from "../../models/order";
import { TicketModel } from "../../models/tickets";
import { nats } from "../../natsWrapper";

it("returns an error if the ticket is not exist", async () => {
  const ticketID = new mongoose.Types.ObjectId().toHexString();
  return Request(app)
    .post("/api/orders/")
    .set("Cookie", await getCookie())
    .send({
      ticketID,
    })
    .expect(404);
});

it("return an errors if the tickets is reserved ", async () => {
  const userID = new mongoose.Types.ObjectId().toHexString();
  const dateObj = new Date();
  dateObj.setSeconds(dateObj.getSeconds() + 15 * 60);

  const ticket = TicketModel.build({
    title: "concert",
    price: 2540,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  console.log(ticket);

  await ticket.save();

  const order = OrderModel.build({
    userID,
    status: OrderStatus.Created,
    ticket: ticket,
    expiresAt: dateObj,
  });

  await order.save();

  await Request(app)
    .post("/api/orders")
    .set("Cookie", await getCookie())
    .send({
      ticketID: ticket.id,
    })
    .expect(400);
});

it("order create sucessfully", async () => {
  const ticket = TicketModel.build({
    title: "concert",
    price: 2540,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await Request(app)
    .post("/api/orders")
    .set("Cookie", await getCookie())
    .send({
      ticketID: ticket.id,
    })
    .expect(201);
});

it("publish event create order", async () => {
  const ticket = TicketModel.build({
    title: "concert",
    price: 2540,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await Request(app)
    .post("/api/orders")
    .set("Cookie", await getCookie())
    .send({
      ticketID: ticket.id,
    })
    .expect(201);

  expect(nats.getClient.publish).toHaveBeenCalled();
});
