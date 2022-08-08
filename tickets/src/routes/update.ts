import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";
import { TicketUpdatePublisher } from "../events/publisher/TicketUpdatePublisher";
import { nats } from "../natsWrapper";

import {
  NotFoundError,
  NotAuthorized,
  AuthRequire,
  commonError,
  BadRequestError,
} from "@vsticketing012/common";
const Router = express.Router();

Router.put(
  "/api/tickets/:id",
  AuthRequire,
  [
    body("title").not().isEmpty().withMessage("please enter valid title"),
    body("price").isFloat({ gt: 0 }).withMessage("please enter valid price"),
  ],
  commonError,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    console.log(ticket.orderId);

    if (ticket.orderId) {
      throw new BadRequestError("this is a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    new TicketUpdatePublisher(nats.getClient).publisher({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userID: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { Router as updateRouter };
