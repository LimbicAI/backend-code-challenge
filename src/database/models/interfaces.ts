import { Document } from "mongoose";

export interface IUser extends Document {
  firstname:string;
  lastname:string;
  email: string;
  password: string;
  username: string;
  posts?:[IPost]
  comparePasswords(candidatePassword: string, next: (err: Error | null, same: boolean | null) => void): void;
}

export interface IPost extends Document {
    author: IUser['_id'];
    content: string;
    title: string;
}