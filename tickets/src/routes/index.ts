import express, { Request, Response } from "express";
import { Ticket } from "../model/ticket";
const Router = express.Router();

Router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });
  res.send(tickets);
});

export { Router as indexRouter };
