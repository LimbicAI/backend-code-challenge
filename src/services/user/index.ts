import { ConflictError, UnauthorizedError } from '../../common/error';
import { Password } from '../../common/password';
import { IUser } from '../../database/models/interfaces';

import userModel from '../../database/models/user.model';


import { CreateUserDto, IResetPassword } from './user.dto';

const exlude = {
    _id: 0,
    Password: 0, __v: 0, posts: 0,
    createdAt: 0,
    updatedAt: 0
}

class UsersService {
    async create(data: CreateUserDto): Promise<Partial<IUser | void>> {
        const createUser = new userModel(data);
        await createUser.save();
        return { username: createUser.username, email: createUser.email, id: createUser.id }

    }

    async update(data: Partial<CreateUserDto>, user_id: string): Promise<Partial<IUser | void | string>> {

        //If user wants to update email
        // Ideally, the best way to go is to send a template email to the old email
        // Using nodemailer, sendgrid etc.
        // If user codes not have access to old email, user should contact ADMIN
        // This is a security measure that if not taken, User account can be hijacked

        //HERE'S THE IMPLEMENTATION FLOW
        // Send temple email ==>> user clicks on email which has token embedded[Token contains other details that user wants to update with email e.g  firstname]
        // ==> the email links calls email update_confirm api [A new API]
        if (data?.email) {
            // call the template email function and send email 
            return "email sent to old password to confirm identity"
        }



        // check if user wants to update username and if the username is available
        const isUsernameAvailable = data?.username && await this.getUserByUsername(data.username);

        if (data?.username && isUsernameAvailable) {
            throw new ConflictError('Username is not available')

        }
        const updateUser = await userModel.findByIdAndUpdate(user_id, { ...data }, { new: true }).select(exlude).exec() as IUser;

        return updateUser



    }
    async getUserByEmail(userEmail: string) {
        return userModel.findOne({ email: userEmail }).exec();
    }

    async getUserByUsername(user_name: string) {
        return userModel.findOne({ username: user_name }).exec();
    }

    async resetPassword(data: IResetPassword, user_id: string): Promise<Partial<IUser | void>> {


        // update_password
        if (data.new_password !== data.verify_password) {
            throw new UnauthorizedError('new_password MUST equal verify_password');
        }
        let findUser = await userModel.findById(user_id);

        // compare password
        const isPasswordMatch = await Password.compare(findUser!.password, data.old_password);

        if (!isPasswordMatch) {
            throw new UnauthorizedError('Ensure you enter the correct old_password');
        }

        // update password
        findUser!.password = data.new_password;
        const updatePassword = await findUser!.save()

        return updatePassword


    }

}


export default new UsersService();