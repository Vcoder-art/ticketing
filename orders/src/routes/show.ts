import express, { Request, Response } from "express";
import {
  AuthRequire,
  NotFoundError,
  NotAuthorized,
} from "@vsticketing012/common";
import { OrderModel } from "../models/order";

const router = express.Router();

router.get(
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

    res.json(order);
  }
);

export { router as getOneOrdersRouter };
