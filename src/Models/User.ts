import mongoose, { Schema } from "mongoose";
import { Iuser } from "../Interfaces/Iuser";
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    posts: [],
  },

  { timestamps: true }
);
const User = mongoose.model<Iuser>("User", UserSchema);
export default User;
