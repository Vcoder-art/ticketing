import mongoose from "mongoose"

interface attrPayment {
    orderID:string;
    stripeID:string
}

interface paymentDoc extends mongoose.Document {
    orderID:string;
    stripeID:string;
}

interface paymentModel  extends mongoose.Model<paymentDoc>{
    build(data:attrPayment):paymentDoc;
}

const schema = new mongoose.Schema({
    orderID:{
        type:String,
        required:true
    },
    stripeID:{
        type:String,
        required:true
    },
},{
    toJSON:{
        transform(doc,ret){
          ret.id=ret._id;
          delete ret._id;
        }
    }
})

schema.statics.build=(attr:attrPayment)=>{
 return new Payment(attr);
}

const Payment = mongoose.model<paymentDoc,paymentModel>("payments",schema);

export {Payment as PaymentModel}