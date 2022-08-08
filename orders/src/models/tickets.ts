import mongoose from "mongoose";
import { OrderModel, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
  title: string;
  price: number;
  id: string;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attr: TicketAttr): TicketDoc;
  findByEvent(data: { id: string; version: number }): Promise<TicketDoc | null>;
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

schema.set("versionKey", "version");
// schema.plugin(updateIfCurrentPlugin);

// pre save hook
//$where property only works when isNew is false
// that works only update operation
schema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - 1,
  };
  done();
});

schema.statics.findByEvent = async (data: { id: string; version: number }) => {
  return await TicketModel.findById({
    _id: data.id,
    version: data.version - 1,
  });
};

schema.statics.build = (attr: TicketAttr) => {
  return new TicketModel({
    _id: attr.id,
    title: attr.title,
    price: attr.price,
  });
};

schema.methods.isReserved = async function () {
  const existingOrder = await OrderModel.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const TicketModel = mongoose.model<TicketDoc, TicketModel>("tickets", schema);

export { TicketModel };
