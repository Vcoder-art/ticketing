import express, { request, Request, Response } from "express";
import { AuthRequire, commonError } from "@vsticketing012/common";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";
import { TicketCreatePublisher } from ".././events/publisher/TicketCreatePublisher";
import { nats } from "../natsWrapper";

const Router = express.Router();

Router.post(
  "/api/tickets",
  AuthRequire,
  [
    body("title").not().isEmpty().withMessage("title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("enter valid price"),
  ],
  commonError,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    const tcp = new TicketCreatePublisher(nats.getClient);
    await tcp.publisher({
      id: ticket.id,
      price: ticket.price,
      userID: req.currentUser!.id,
      title: ticket.title,
      version: ticket.version,
    });

    res.status(201).json(ticket);
  }
);

export { Router as createTicketsRouter };
