import { redisClient } from '../connect';
import { logger } from './logger';

export const redisLimiter = async (key: string, secondsToExpire: number=60,) => {
    try {
        const [response] = await redisClient
            .multi()
            .incr(key)
            .expire(key, secondsToExpire)
            .exec();

        return response
    } catch (error) {

        logger.error('REDISLIMITER>>', error)
        //The class or any function calling this can handle the error
        // E.g throw some err occured and check the logs
        return;
    }
}

export const redisRetrieveValue = async (key: string) => {
const getValue = await  redisClient.get(key);
return getValue
}


export const endDateGreater =(start:string, end:string)=>{
    const start_date = new Date(start);
    const end_date = new Date(end)
    return end_date >= start_date ;
  }
