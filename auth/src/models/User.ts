import mongoose, { Schema } from "mongoose";
import { Password } from "../services/passwordHash";

// type checking of user Properties
interface UserAtt {
  email: string;
  password: string;
}

// create a UserModelInterface to describe the information of the
interface UserInterface extends mongoose.Model<UserDoc> {
  build(attr: UserAtt): UserDoc;
}

// single user document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
UserSchema.statics.build = (attr: UserAtt) => {
  return new UserModel(attr);
};

const UserModel = mongoose.model<UserDoc, UserInterface>("User", UserSchema);

export { UserModel };
