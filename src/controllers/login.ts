import { Response } from 'express';
import { SuccessResponseObject } from '../common/http';
import { ICustomRequest } from '../middleware/auth';
import LoginService from '../services/login/index';


export const loginUserController = async (req: ICustomRequest, res: Response) => {
   
    const token = await LoginService.loginUser(req.body);
    // Return Auth header, this token will be used to auth user 
    res.setHeader(
        "Authorization",
        `Bearer ${token}`
    );
    return res.status(200).json(new SuccessResponseObject('Login successful', { email: req.currentUser?.email, username: req.currentUser?.username, access_token: token }));
}




