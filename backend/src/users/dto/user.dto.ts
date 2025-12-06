export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  imageUrl?: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class UpdateUserDto {
  name?: string;
  imageUrl?: string;
  isActive?: boolean;
}
