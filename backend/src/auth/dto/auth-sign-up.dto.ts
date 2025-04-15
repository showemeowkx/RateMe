import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class AuthSignUpCredDto {
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  surname: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*\d)/, { message: 'The password is too weak!' })
  password: string;
}
