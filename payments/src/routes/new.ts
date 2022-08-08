import {
  AuthRequire,
  BadRequestError,
  NotFoundError,
  commonError,
  NotAuthorized,
  OrderStatus,
} from "@vsticketing012/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import express, { Request, Response } from "express";
import { stripe } from "../stripe";
import { PaymentModel } from "../models/payment";
import { PaymentPublisher } from "../event/publisher/paymentPublisher";
import { nats } from "../natsWrapper";

const router = express.Router();

router.post(
  "/api/payments",
  AuthRequire,
  [
    body("token").not().isEmpty().withMessage("token not exist"),
    body("orderID").not().isEmpty().withMessage("orderID not exist"),
  ],
  commonError,
  async (req: Request, res: Response) => {
    const { token, orderID } = req.body;

    const order = await Order.findById(orderID);

    if (!order) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== order.userID) {
      throw new NotAuthorized();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("you not paid for cancelled order");
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("this order is already paid");
    }

    const payment = await stripe.charges.create({
      amount: order.price * 100,
      currency: "inr",
      source: token,
    });

    const chargeRecord = PaymentModel.build({
      orderID,
      stripeID: payment.id,
    });
    await chargeRecord.save();

    order.set({ status: OrderStatus.Complete });
    await order.save();

    new PaymentPublisher(nats.getClient).publisher({
      id: chargeRecord.id,
      orderID: chargeRecord.orderID,
      stripeID: chargeRecord.stripeID,
    });

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
