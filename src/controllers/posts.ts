import { Response } from 'express';
import { SuccessResponseObject } from '../common/http';
import { ICustomRequest } from '../middleware/auth';
import PostService from '../services/post/index';

export const createPost = async (req: ICustomRequest, res: Response) => {
    
    const newPost = await PostService.create(req.body, `${req.userDetails?.id}`);
    return res.status(201).json(new SuccessResponseObject('Post succesfully created 🥳 🥳', newPost));
}


export const retrievePosts  = async (req: ICustomRequest, res: Response) => {
    const allPosts = await PostService.fetchAll(`${req.userDetails?.id}`, req.query);
    return res.status(200).json(new SuccessResponseObject('Posts succesfully fetched for user 🥳 🥳', allPosts));
}


