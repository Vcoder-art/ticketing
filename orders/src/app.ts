import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUser } from "@vsticketing012/common";
import { ErrorHandler } from "@vsticketing012/common";
import { NotFoundError } from "@vsticketing012/common";
import cookieSession from "cookie-session";

import { deleteOrdersRouter } from "./routes/delete";
import { indexOrdersRouter } from "./routes/index";
import { createOrdersRouter } from "./routes/new";
import { getOneOrdersRouter } from "./routes/show";

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
app.use(deleteOrdersRouter);
app.use(indexOrdersRouter);
app.use(createOrdersRouter);
app.use(getOneOrdersRouter);

app.all("*", async () => {
  console.log("not found error");
  throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };
