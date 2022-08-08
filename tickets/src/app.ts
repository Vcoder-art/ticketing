import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUser } from "@vsticketing012/common";
import { ErrorHandler } from "@vsticketing012/common";
import { NotFoundError } from "@vsticketing012/common";
import cookieSession from "cookie-session";
import { createTicketsRouter } from "./routes/new";
import { RouterShowTickets } from "./routes/showTicket";
import { indexRouter } from "./routes/index";
import { updateRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json({ limit: "2mb" }));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(createTicketsRouter);
app.use(RouterShowTickets);
app.use(indexRouter);
app.use(updateRouter);

app.all("*", async () => {
  console.log("not found error");
  throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };
