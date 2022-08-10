import { Schema, model } from "mongoose";
import { Password } from "../../common/password";


import { IUser } from "./interfaces";

const UserSchema: Schema = new Schema(
  {
    firstname: { type: String, required: [true, "Field is required"] },
    lastname: { type: String, required: [true, "Field is required"] },
    email: { type: String, required: [true, "Field is required"], unique: true, index: true },
    password: { type: String, required: [true, "Field is required"] },
    username: { type: String, required: [true, "Field is required"], unique: true, index: true },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (_doc, _ret) {},
    },
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.password;  //Dont expose the password in response
      },
    },
  }
);
//Hash password 
UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});


const userModel = model<IUser>("User", UserSchema);

export default userModel;
