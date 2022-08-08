import Request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/getCookie";
import mongoose, { set } from "mongoose";
import { nats } from "../../natsWrapper";
import { Ticket } from "../../model/ticket";

it("if provided id is not exist to update", async function () {
  const id = new mongoose.Types.ObjectId().toHexString();

  await Request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", await getCookie())
    .send({
      title: "this is new title",
      price: 454,
    })
    .expect(404);
});

it("if any unautherzied person can access the update api", async function () {
  const id = new mongoose.Types.ObjectId().toHexString();
  await Request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "this is new title",
      price: 454,
    })
    .expect(401);
});

it("if person not update own ticket", async function () {
  const response = await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({
      title: "iam right now",
      price: 454,
    })
    .expect(201);

  await Request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await getCookie())
    .send({
      title: "yes iam now",
      price: 122,
    })
    .expect(401);
});

it("the person provided invalid input to update", async function () {
  const Cookie = await getCookie();

  const response = await Request(app)
    .post("/api/tickets")
    .set("Cookie", Cookie)
    .send({
      title: "hellojs",
      price: "100000",
    })
    .expect(201);

  await Request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", Cookie)
    .send({
      title: "",
      price: 5254,
    })
    .expect(400);

  await Request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", Cookie)
    .send({
      title: "vishal is hero",
      price: -85,
    })
    .expect(400);
});

it("successfully update", async function () {
  const Cookie = await getCookie();

  const response = await Request(app)
    .post("/api/tickets")
    .set("Cookie", Cookie)
    .send({
      title: "hellojs",
      price: "100000",
    })
    .expect(201);

  const updateResponse = await Request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", Cookie)
    .send({
      title: "microservices",
      price: "1000",
    })
    .expect(200);

  expect(updateResponse.body.title).toEqual("microservices");
  expect(updateResponse.body.price).toEqual(1000);
});

it("update event should publish", async () => {
  const Cookie = await getCookie();

  const response = await Request(app)
    .post("/api/tickets")
    .set("Cookie", Cookie)
    .send({
      title: "hellojs",
      price: "100000",
    })
    .expect(201);

  const updateResponse = await Request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", Cookie)
    .send({
      title: "microservices",
      price: "1000",
    })
    .expect(200);

  expect(nats.getClient.publish).toHaveBeenCalled();
});

it("this is a reserved ticket", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: "concert",
    price: 1000,
    userId: "ihfuiwfwgf",
  });

  ticket.set({ orderId });

  await ticket.save();

  await Request(app)
    .put("/api/tickets/" + ticket.id)
    .set("Cookie", await getCookie())
    .send({
      title: "microservices",
      price: 2000,
    })
    .expect(400);
});
