import Request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/getCookie";
import mongoose from "mongoose";

it("if ticket not found return status 404", async function () {
  const id = new mongoose.Types.ObjectId().toHexString();

  const res = await Request(app)
    .get("/api/tickets/" + id)
    .send()
    .expect(404);
  console.log(res.body, id);
});

it("check if ticket is found", async function () {
  const price = 521;
  const title = "concert";

  const response = await Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({ title, price });
  expect(201);

  const tickerResponse = await Request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(tickerResponse.body.title).toEqual(title);
  expect(tickerResponse.body.price).toEqual(price);
});
