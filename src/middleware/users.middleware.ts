
import { Request, Response, NextFunction } from 'express';
import { ErrorResponseObject } from '../common';
import UsersService from '../services/user/index';


class UsersMiddleware {

    async emailTaken(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

       //TODO:
       //Add redis here for faster retrieval
        const user = await UsersService.getUserByEmail(req.body.email)
        if (user) {
            return res.status(409).json(new ErrorResponseObject('email already exists'));

        } else {
            next();
        }
    }

    async usernameAvailability(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

       //TODO:
       //Add redis here
        const usernameExist = await UsersService.getUserByUsername(req.body.username)
        if (usernameExist) {
            return res.status(409).json(new ErrorResponseObject('Username not Available 🥺'));

        } else {
            next();
        }
    }

    async emailExists(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        
          //TODO:
       //Add redis here for faster retrieval
        const user = await UsersService.getUserByEmail(req.body.email)
        if (!user) {
            return res.status(404).json(new ErrorResponseObject('Email does not exist 🥶'));

        } else {
            next();
        }
    }


}

export default new UsersMiddleware();
