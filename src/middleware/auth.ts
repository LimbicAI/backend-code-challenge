import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from "jsonwebtoken"
import { ErrorResponseObject, logger } from '../common';
import { IUser } from '../database/models/interfaces';
import { env } from '../config';
import { LoginDto } from '../services/login/login.dto';


// Declaration merging to extend Express Request Object
export interface ICustomRequest extends Request {
    currentUser?: IUser;
    userDetails?: LoginDto;

}


class JwtAuth {

    authenticateJWT(req: ICustomRequest, res: Response, next: NextFunction) {

        const authHeader = req.headers?.authorization?.split('Bearer ')[1];
        try {
            if (authHeader && authHeader !== "null") {
                const decode = jwt.verify(authHeader, env.jwtSecret);
                const { userDetails } = decode as LoginDto
                req.userDetails = userDetails

                if (req?.body?.email && req.body.email !== req?.userDetails?.email) {
                    return res.status(403).json(new ErrorResponseObject('ACCESS DENIED!'));
                }

                next();
            } else {
                res.status(403).json(new ErrorResponseObject('Unauthorized: Auth Header is required'));
            }
        } catch (error) {
            let errMsg = ''
            if (error instanceof JsonWebTokenError) {
                errMsg = error.message === 'jwt expired' ? 'Token Expired, please login' : 'Invalid token'
                return res.status(401).json(new ErrorResponseObject(errMsg));

            }

            logger.error("JWT_ERROR_", error)

            return res.status(500).json(new ErrorResponseObject('some error occurred...admin fixing 🥺'));
        }








    }
}

export default new JwtAuth();
