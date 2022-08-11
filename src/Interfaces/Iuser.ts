import { Document } from "mongoose";
import { Ipost } from "./Ipost";
export interface Iuser extends Document {
  _id?: string;
  username: string;
  firstname: string;
  surname: string;
  posts?: Ipost[];
}
