import { Request, Response } from 'express';
import { BadRequestError } from '../common/error';
import { SuccessResponseObject } from '../common/http';
import { ICustomRequest } from '../middleware/auth';
import UsersService from '../services/user/index';


export const signUp = async (req: Request, res: Response) => {
    const createUser = await UsersService.create(req.body);
    return res.status(201).json(new SuccessResponseObject('sign up successful', createUser));
}


export const updateProfile = async (req: ICustomRequest, res: Response) => {

    if (Object.keys(req.body).length === 0) {
        throw new BadRequestError('No payload passed for update')
    }
    const updateUser = await UsersService.update(req.body, `${req.userDetails?.id}`);
    return res.status(200).json(new SuccessResponseObject('User profile update succesful', updateUser));


}


export const resetPassword = async (req: ICustomRequest, res: Response) => {
    const reset = await UsersService.resetPassword(req.body, `${req.userDetails?.id}`);
    return res.status(200).json(new SuccessResponseObject('Password reset successful', reset));
}



