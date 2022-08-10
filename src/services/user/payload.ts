import { body } from 'express-validator';

export const validateCreateUser = [
   body('userName', "userName doesn't exists").exists(),
   body('email', 'Invalid email').exists().isEmail(),
   body('password').isString().isStrongPassword({
    minLength:8,
    minLowercase:1,
    minNumbers:1,
    minSymbols:1,
    minUppercase:1
   }).withMessage('Password must be 8 or more characters long, and must contain one or more uppercase, lowercase,number and special character ').exists().bail(),
];