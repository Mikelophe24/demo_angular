export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}

export type User = {
    id: string , 
    email : string, 
    name: string ,
    imageUrl : string,
    role: UserRole, // Thêm role cho user
}

export type SignUpParams = {
    name: string, 
    email: string, 
    password: string, 
    checkout? : boolean,
    dialogId : string,
    role?: UserRole, // Optional role khi đăng ký
}

export type SignInParams = Omit<SignUpParams, "name">;