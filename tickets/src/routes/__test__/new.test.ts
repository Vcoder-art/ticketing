import Request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/getCookie";
import { Ticket } from "../../model/ticket";
import { nats } from "../../natsWrapper";

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await Request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed that user was signed in", async () => {
  const response = await Request(app).post("/api/tickets").send({});

  expect(response.status).toEqual(401);
});

it("can signin with different status", async () => {
  const response = await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({});
  console.log(response.status);
  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title privided", async () => {
  await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({
      price: 145,
      title: "",
    })
    .expect(400);

  await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({
      price: 145,
    })
    .expect(400);
});

it("returns an error if invalid price provided", async () => {
  await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({
      price: -145,
      title: "wfwefwefwef",
    })
    .expect(400);

  await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({
      title: "sdvlkvlkdvkle",
    })
    .expect(400);
});

it("create a ticket with valid input", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({ title: "this is title", price: 454.56 })
    .expect(201);

  tickets = await Ticket.find({});
  console.log(tickets);
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("this is title");
  expect(tickets[0].price).toEqual(454.56);
});

it("publish event =to create a ticket", async () => {
  await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({ title: "this is title", price: 454.56 })
    .expect(201);
  console.log(nats.getClient.publish);
  expect(nats.getClient.publish).toHaveBeenCalled();
});
