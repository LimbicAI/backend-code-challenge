import { Response, Request, NextFunction } from 'express';
import { ErrorResponseObject } from '../common';
import { redisLimiter } from '../common/utils';



class RateLimiting {

    async apiRateLimiter(req: Request, res: Response, next: NextFunction) {
        const limit: number = 50;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
        const checkRedisLimiter = await redisLimiter(ip as string, 60); // a minute

        //if the function return null or undefined, means there's an error
        //return a generic error and go check the logs
        if (!checkRedisLimiter) {
            return res.status(500).json(new ErrorResponseObject('Connection error..Admin fixing 🛠'));
        }

        if (checkRedisLimiter > limit) {
            return res.status(429).json(new ErrorResponseObject('Too many requests, try again in a minute'));
        }

        next()
    }
}



export default new RateLimiting()
