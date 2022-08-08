import express, { Request, Response } from "express";
import {
  AuthRequire,
  commonError,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@vsticketing012/common";
import mongoose from "mongoose";
import { body } from "express-validator";
import { TicketModel } from "../models/tickets";
import { OrderModel } from "../models/order";
import { OrderCreatePublisher } from "../events/publisher/orderCreatePublisher";
import { nats } from "../natsWrapper";

const router = express.Router();
const EXPIRATION_WINDOW_TIME = 1 * 60;

router.post(
  "/api/orders/",
  AuthRequire,
  [
    body("ticketID")
      .not()
      .isEmpty()
      .custom((str: string) => mongoose.Types.ObjectId.isValid(str))
      .withMessage("ticketID must be provided"),
  ],
  commonError,
  async (req: Request, res: Response) => {
    const { ticketID } = req.body;
    //find the ticket to be ordered

    const ticket = await TicketModel.findById(ticketID);

    if (!ticket) {
      throw new NotFoundError();
    }

    //check the ticket is not reserved
    //first check this ticket is associated with another order
    //and check the order status is not equal to cancelled

    const existingOrder = await ticket.isReserved();

    if (existingOrder) {
      throw new BadRequestError("this ticket is already reserved");
    }

    // create 15 min expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_TIME);

    //build the order and save into data base

    const order = OrderModel.build({
      userID: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    //publish the event the order is created
    const pub = new OrderCreatePublisher(nats.getClient);

    await pub.publisher({
      version: order.version,
      id: order.id,
      userID: req.currentUser!.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrdersRouter };
