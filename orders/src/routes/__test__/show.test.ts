import mongoose from "mongoose";
import Request from "supertest";
import { app } from "../../app";
import { OrderModel } from "../../models/order";
import { TicketModel } from "../../models/tickets";
import { getCookie } from "../../test/getCookie";

it("returns error if ticket is not found and if user try to access another user order ", async () => {
  const fakeID = new mongoose.Types.ObjectId().toHexString();
  const cookie = await getCookie();
  const cookie2 = await getCookie();

  await Request(app)
    .get("/api/orders/" + fakeID)
    .set("Cookie", cookie)
    .send({})
    .expect(404);

  const ticket = TicketModel.build({
    title: "concert movies",
    price: 4454,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = await Request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketID: ticket.id })
    .expect(201);

  await Request(app)
    .get("/api/orders/" + order.body.id)
    .set("Cookie", cookie2)
    .send({})
    .expect(401);
});

it("fetch order sucessfully", async () => {
  const cookie = await getCookie();
  const ticket = TicketModel.build({
    title: "concert movies",
    price: 4454,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = await Request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketID: ticket.id })
    .expect(201);

  await Request(app)
    .get("/api/orders/" + order.body.id)
    .set("Cookie", cookie)
    .send({})
    .expect(200);
});
