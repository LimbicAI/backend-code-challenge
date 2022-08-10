import jwt from "jsonwebtoken";
import { LoginDto } from "./login.dto";
import UsersService from '../user/index'
import { NotFoundError, TooManyRequestError, UnauthorizedError } from "../../common/error";
import { Password } from "../../common/password";
import { redisLimiter, redisRetrieveValue } from "../../common/utils";
import { env  } from '../../config/index';
import { IUser } from "../../database/models/interfaces";


class LoginService {


    async generateToken(userDetails: Partial<LoginDto>): Promise<string | void> {
        return jwt.sign({userDetails} , env.jwtSecret, {
            expiresIn: env.tokenExpirationInSeconds,
        });
    }
    async loginUser(payload: LoginDto): Promise<string | void> {
       
        const { email, password } = payload;
        let failed_attempts =  await redisRetrieveValue(`FailedLogin-${email}`);
    
        // check If email exist
        const findUserByEmail = await UsersService.getUserByEmail(email);

        //Check if user has 3 failed login attempts
        if (failed_attempts && Number(failed_attempts) > 3) {
            throw new TooManyRequestError('Too many failed attempts, try again in a minute')
        }

        if (!findUserByEmail) {
             // For every failed attempts, INCR
            await redisLimiter(`FailedLogin-${email}`);
            throw new NotFoundError('Email does not exist')
        }

        // compare password
        const isPasswordMatch = await Password.compare(findUserByEmail.password, password);

        if (!isPasswordMatch) {
           
            await redisLimiter(`FailedLogin-${email}`);

            throw new UnauthorizedError('Incorrect password')
        }
        const detailsToSign:Partial<IUser>={
            email:findUserByEmail.email,
            id:findUserByEmail.id
        }
        return this.generateToken(detailsToSign);

    }
}


export default new LoginService();