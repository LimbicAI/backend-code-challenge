import {Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { ErrorResponseObject } from '../common';

class PayloadValidationMiddleware {
    verifyBodyFieldsErrors(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error_data = errors.array();
            return res.status(400).json(new ErrorResponseObject('validation error', error_data));
        }
        next();
    }
}

export default new PayloadValidationMiddleware();
