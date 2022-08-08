import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const getCookie = async (id?: string) => {
  //create a payload

  const payload = {
    email: "vishalsahu012@gmail.com",
    id: id || new mongoose.Types.ObjectId().toHexString(),
  };

  // create a jwt token

  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  // create session object

  const SessionToken = {
    jsonWebToken: token,
  };

  // convert into json

  const JsonSessionObject = JSON.stringify(SessionToken);

  // convert into base 64 encoded

  const base64 = Buffer.from(JsonSessionObject).toString("base64");

  // return that object string

  return [`session=${base64}`];
};

export { getCookie };
