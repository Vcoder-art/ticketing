import express, { Request, Response } from "express";
import { body } from "express-validator";
import { commonError } from "@vsticketing012/common";
import { UserModel } from "../models/User";
import { BadRequestError } from "@vsticketing012/common";
import { Password } from "../services/passwordHash";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/signin",
  [
    body("email").isEmail().withMessage("please enter valid email"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("the password field is mandatory"),
  ],
  commonError,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      throw new BadRequestError("enter valid credentials");
    }

    const isMatched = await Password.toCompare(existUser.password, password);

    if (!isMatched) {
      throw new BadRequestError("enter valid credentials");
    }

    const jsonWebToken = jwt.sign(
      { id: existUser.id, email: existUser.email },
      process.env.JWT_SECRET!
    );

    req.session = {
      jsonWebToken,
    };

    res.status(200).json(existUser);
  }
);

export { router as signInRouter };
