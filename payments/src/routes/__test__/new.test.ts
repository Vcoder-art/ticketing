import { OrderStatus } from "@vsticketing012/common";
import mongoose from "mongoose";
import Request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { getCookie } from "../../test/getCookie";
import { stripe } from "../../stripe";
import { PaymentModel } from "../../models/payment";

it("order not found", async () => {
  await Request(app)
    .post("/api/payments")
    .set("Cookie", await getCookie())
    .send({
      token: "dfdfsdf",
      orderID: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("check order can belong to another user", async () => {
  const order = Order.build({
    version: 0,
    userID: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 234,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await order.save();

  await Request(app)
    .post("/api/payments")
    .set("Cookie", await getCookie())
    .send({
      token: "dfdfsdf",
      orderID: order.id,
    })
    .expect(401);
});

it("cheks this order can not be cancelled", async () => {
  const userID = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    version: 0,
    userID,
    status: OrderStatus.Cancelled,
    price: 234,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await order.save();

  await Request(app)
    .post("/api/payments")
    .set("Cookie", await getCookie(userID))
    .send({
      token: "dfdfsdf",
      orderID: order.id,
    })
    .expect(400);
});

it("checks payment charge sucessfully", async () => {
  const userID = new mongoose.Types.ObjectId().toHexString();
  const amount = Math.floor(Math.random() * 100000);

  const order = Order.build({
    userID,
    price: amount,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await Request(app)
    .post("/api/payments")
    .set("Cookie", await getCookie(userID))
    .send({
      token: "tok_amex",
      orderID: order.id,
    })
    .expect(200);

  const charges = await stripe.charges.list({
    limit: 10,
  });
  // console.log(charges.data[0]);

  const charge = charges.data.find((charge) => {
    return charge.amount === amount * 100;
  });
  const chargeRecord = await PaymentModel.findOne({
    orderID: order.id,
    stripeID: charge!.id,
  });

  console.log(chargeRecord);

  expect(chargeRecord).not.toBeNull();
  expect(charge).toBeDefined();
});
