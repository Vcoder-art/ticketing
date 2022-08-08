import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: any;

jest.mock("../natsWrapper.ts");
process.env.STRIPE_SECRET =
  "sk_test_51I1ZEBCSi1YywohrI6V9BtutvJhmV694U2lOoiDjTYtzqKAEBgK2ISY3iAUg3kd3AYxh3XarDu86WcrSp7JqUXqq00hJMrsUyB";

beforeAll(async () => {
  // console.log("iam before all")
  process.env.JWT_SECRET = "jueujjwefjwej";
  mongo = new MongoMemoryServer();
  const uri = await mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  console.log("iam after All");
  await mongo.stop();
  await mongoose.connection.close();
});
