import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";
import { signOutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signUp";
import { ErrorHandler } from "@vsticketing012/common";
import { NotFoundError } from "@vsticketing012/common";

import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json({ limit: "2mb" }));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  console.log("not found error" + "this is auth service");
  throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };
