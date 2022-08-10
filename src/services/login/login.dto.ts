import {CreateUserDto} from '../user/user.dto';
export interface LoginDto extends  Pick<CreateUserDto, "email" | "password" |"id">{

    userDetails?:CreateUserDto
}