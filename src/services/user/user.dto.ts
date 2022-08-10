export interface CreateUserDto {
    email: string;
    password: string;
    username: string;
    firstname:string;
    lastname:string;
    id?:string;

}

export interface IResetPassword {
    email: string;
    old_password: string;
    new_password: string;
    verify_password:string;

}