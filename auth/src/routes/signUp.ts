import express, { Request, Response } from "express";
import { body } from "express-validator";
import { UserModel } from "../models/User";
import { BadRequestError } from "@vsticketing012/common";
import jwt from "jsonwebtoken";
import { commonError } from "@vsticketing012/common";

const router = express.Router();

router.post(
  "/api/signup",
  [
    body("email").isEmail().withMessage("please enter valid email data"),

    body("password")
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage("please enter valid password"),
  ],
  commonError,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExist = await UserModel.findOne({ email }).exec();
    if (userExist) {
      throw new BadRequestError("this user already exist");
    }
    const user = UserModel.build({ email, password });
    await user.save();

    // jwt secret
    //   console.log(process.env.JWT_SECRET!);

    const jsonWebToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!
    );
    // console.log(jsonWebToken);
    req.session = {
      jsonWebToken,
    };
    res.status(201).json(user);
  }
);

export { router as signUpRouter };
