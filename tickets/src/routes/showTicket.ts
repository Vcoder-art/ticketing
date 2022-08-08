import express, { Request, Response } from "express";
const Router = express.Router();
import { Ticket } from "../model/ticket";
import { NotFoundError } from "@vsticketing012/common";

Router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (ticket) {
    return res.status(200).json(ticket);
  } else {
    throw new NotFoundError();
  }
});

export { Router as RouterShowTickets };
