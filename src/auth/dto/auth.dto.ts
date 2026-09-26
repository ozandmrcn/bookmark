import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Signup payload: full registration of a new user account.
 */
export class SignupDTO {
  @IsEmail() // must be a valid email address
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

/**
 * Login payload: only email + password are required to authenticate.
 */
export class LoginDTO {
  @IsEmail() // must be a valid email address
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
