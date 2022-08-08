import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUser } from "@vsticketing012/common";
import { ErrorHandler } from "@vsticketing012/common";
import { NotFoundError } from "@vsticketing012/common";
import cookieSession from "cookie-session";
import { createChargeRouter } from "./routes/new";

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
app.use(createChargeRouter);

app.all("*", async () => {
  console.log("not found error");
  throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };
