import Request from "supertest";
import { app } from "../../app";
import { OrderModel, OrderStatus } from "../../models/order";
import { TicketModel } from "../../models/tickets";
import { getCookie } from "../../test/getCookie";
import mongoose from "mongoose";

it("fetch sucessfully orders", async () => {
  const ticket = TicketModel.build({
    title: "concert",
    price: 5254,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  const ticket2 = TicketModel.build({
    title: "concert2",
    price: 5254,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  const ticket3 = TicketModel.build({
    title: "concert3",
    price: 5254,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  await ticket2.save();
  await ticket3.save();

  const cookieUser1 = await getCookie();
  const cookieUser2 = await getCookie();

  const { body: reponseOrder1 } = await Request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser1)
    .send({
      ticketID: ticket.id,
    })
    .expect(201);

  const { body: responseOrder2 } = await Request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser2)
    .send({
      ticketID: ticket2.id,
    })
    .expect(201);

  const { body: responseOrder3 } = await Request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser2)
    .send({
      ticketID: ticket3.id,
    })
    .expect(201);

  const data = await Request(app)
    .get("/api/orders")
    .set("Cookie", cookieUser2)
    .send({})
    .expect(200);

  expect(data.body.length).toEqual(2);
  expect(data.body[0].id).toEqual(responseOrder2.id);
  expect(data.body[1].id).toEqual(responseOrder3.id);
  expect(data.body[0].ticket.id).toEqual(ticket2.id);
  expect(data.body[1].ticket.id).toEqual(ticket3.id);
});
