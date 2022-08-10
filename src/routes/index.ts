import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { SuccessResponseObject } from '../common';
import { signUp, loginUserController, createPost, retrievePosts, updateProfile, resetPassword } from '../controllers/index';
import PayloadValidationMiddleware from '../middleware/validator'
import { handleAsyncError } from '../middleware/errorHandler';
import UsersMiddleware from '../middleware/users.middleware';
import JwtAuth from '../middleware/auth'


const router = Router();

const password_options = {
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
}

router.post('/signup',
    body('username', "username is required").exists(),
    body('lastname', "lastname is required").exists(),
    body('firstname', "firstname is required").exists(),
    body('email', 'Invalid email format').exists().isEmail(),
    body('password').isString().isStrongPassword(password_options).withMessage('Password must be 8 or more characters long, and must contain one or more uppercase, lowercase,number and special character ').exists(),
    PayloadValidationMiddleware.verifyBodyFieldsErrors,
    UsersMiddleware.emailTaken,
    UsersMiddleware.usernameAvailability,
    handleAsyncError(signUp));




router.post('/login',
    body('email', 'email is required').exists().isEmail(),
    body('password').isString().isStrongPassword(password_options).withMessage('Password must be 8 or more characters long, and must contain one or more uppercase, lowercase,number and special character ').exists(),
    PayloadValidationMiddleware.verifyBodyFieldsErrors,
    UsersMiddleware.emailExists,
    handleAsyncError(loginUserController));


//change password
router.put('/reset-password',
    body('email', 'email is required').exists().isEmail(),
    body('old_password', 'old_password is required').isString().exists(),
    body('new_password', 'new_password is required').isString().isStrongPassword(password_options).withMessage('Password must be 8 or more characters long, and must contain one or more uppercase, lowercase,number and special character ').exists(),
    body('verify_password', 'verify_password must be equal to new_password').isString().isStrongPassword(password_options).exists(),
    PayloadValidationMiddleware.verifyBodyFieldsErrors,
    UsersMiddleware.emailExists,
    JwtAuth.authenticateJWT,
    handleAsyncError(resetPassword));


router.post('/post',
    body('title', "title is required").isString().isLength({ max: 20 }).exists(),
    body('content', 'content is require').exists(),
    PayloadValidationMiddleware.verifyBodyFieldsErrors,
    JwtAuth.authenticateJWT,
    handleAsyncError(createPost));


//retrieve all posts by user
router.get('/posts',
    query('start').isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('date format must be YYYY-MM-DD').optional(),
    query('end').isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('date format must be YYYY-MM-DD').optional(),
    query('limit').isNumeric().withMessage('limit must be a number').optional(),
    PayloadValidationMiddleware.verifyBodyFieldsErrors,
    JwtAuth.authenticateJWT,
    handleAsyncError(retrievePosts));

//Update users profile

router.put('/user',
    body('username', "username is required").optional(),
    body('lastname').optional(),
    body('email').isEmail().optional(),
    PayloadValidationMiddleware.verifyBodyFieldsErrors,
    JwtAuth.authenticateJWT,
    handleAsyncError(updateProfile));


router.get('/', (_, res: Response) => res.json(new SuccessResponseObject('path live 🚀')));
export default router;
