import { Schema, model } from "mongoose";

import { IPost } from "./interfaces";


const postSchema = new Schema({
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  content: String,
  title: String,
},
  {
    timestamps: true
  });

const postModel = model<IPost>('Post', postSchema);

export default postModel;