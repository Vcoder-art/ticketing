import express, { Request, Response } from "express";
import { OrderModel, OrderStatus } from "../models/order";
import {
  AuthRequire,
  NotAuthorized,
  NotFoundError,
} from "@vsticketing012/common";
import { OrderCancelPublisher } from "../events/publisher/orderCancelPublisher";
import { nats } from "../natsWrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderID",
  AuthRequire,
  async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.orderID).populate(
      "ticket"
    );

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userID !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish event the order is cancelled

    const pub = new OrderCancelPublisher(nats.getClient);
    await pub.publisher({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).json(order);
  }
);

export { router as deleteOrdersRouter };
