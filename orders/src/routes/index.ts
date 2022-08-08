import express, { Request, Response } from "express";
import { AuthRequire } from "@vsticketing012/common";
import { OrderModel } from "../models/order";

const router = express.Router();

router.get("/api/orders", AuthRequire, async (req: Request, res: Response) => {
  const orders = await OrderModel.find({
    userID: req.currentUser!.id,
  }).populate("ticket");
  // console.log(orders);
  res.json(orders);
});

export { router as indexOrdersRouter };
