import mongoose from "mongoose";
import { OrderStatus } from "@vsticketing012/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
  version: number;
  userID: string;
  status: OrderStatus;
  price: number;
  id: string;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userID: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(data: OrderAttr): OrderDoc;
}

const Schema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      delfault: OrderStatus.Created,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

Schema.set("versionKey", "version");
Schema.plugin(updateIfCurrentPlugin);

Schema.statics.build = (data: OrderAttr) => {
  return new Order({
    _id: data.id,
    userID: data.userID,
    price: data.price,
    status: data.status,
    version: data.version,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("orders", Schema);
export { Order };
