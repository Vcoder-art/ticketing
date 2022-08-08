import Request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/getCookie";

const createTicket = async () => {
  return Request(app)
    .post("/api/tickets")
    .set("Cookie", await getCookie())
    .send({
      title: "sdvlkvlkdvkle",
      price: 4554,
    });
};

it("fetch all tickets in database", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await Request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
