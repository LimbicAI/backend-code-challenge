import { Request, Response, NextFunction } from 'express';
import {logger} from '../common/logger'
import { ErrorResponseObject } from '../common';
import { CustomError} from '../common/error';

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
function errorHandler(
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let customError = err;

  if (!(err instanceof CustomError)) {
    //Push error to logs for internal investigation
    logger.error(err);

    customError = new CustomError(
         //Use this generic error message so users wont see error messages like "undefined" or DB error
     "Some error occurred"
    );
  }


 return  res.status(customError.statusCode).json(new ErrorResponseObject(`${customError.message}`));
}



export const handleAsyncError = (controller:any) => (req:Request, res:Response, next:NextFunction) => {
    controller(req, res)?.catch((e:any) => {
      next(e);
    });
  };
  

export default errorHandler;