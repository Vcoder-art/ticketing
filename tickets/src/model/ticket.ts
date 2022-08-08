import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface tickerAttr {
  title: string;
  price: number;
  userId: string;
}

interface ticketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface TicketModel extends mongoose.Model<ticketDocument> {
  build(attr: tickerAttr): ticketDocument;
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
    },
    userId: {
      type: String,
      reuqired: true,
    },
    orderId: {
      type: String,
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
schema.plugin(updateIfCurrentPlugin);

schema.statics.build = function (attr: tickerAttr) {
  return new Ticket(attr);
};

const Ticket = mongoose.model<ticketDocument, TicketModel>("Tickets", schema);

export { Ticket };
