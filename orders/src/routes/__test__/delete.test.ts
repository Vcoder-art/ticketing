import Request from "supertest";
import { TicketModel } from "../../models/tickets";
import { OrderModel, OrderStatus } from "../../models/order";
import { app } from "../../app";
import { getCookie } from "../../test/getCookie";
import { nats } from "../../natsWrapper";
import mongoose from "mongoose";

it("cancelled the order sucessfully", async () => {
  const user = await getCookie();

  const ticket = TicketModel.build({
    title: "concert",
    price: 500,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const { body: order } = await Request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketID: ticket.id,
    })
    .expect(201);

  await Request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await OrderModel.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("publish event when a order is cancelled", async () => {
  const user = await getCookie();

  const ticket = TicketModel.build({
    title: "concert",
    price: 500,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const { body: order } = await Request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketID: ticket.id,
    })
    .expect(201);

  await Request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await OrderModel.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(nats.getClient.publish).toHaveBeenCalled();
});
