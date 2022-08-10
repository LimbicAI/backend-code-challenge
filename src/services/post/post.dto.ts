import { IUser } from "../../database/models/interfaces";

export interface CreatePostDto {
    title: string;
    content: string;
    _id?:string;

}

export interface IQueryPosts{
    limit?:number;
    start?:string;
    end?:string;

}

export interface IAuthor extends Partial<IUser>{}