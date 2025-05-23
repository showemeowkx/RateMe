import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class AuthSignUpCredDto {
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @IsNotEmpty()
  @Matches(/^[A-Z][a-z]+(?:[ -][A-Z][a-z]+)*$/, {
    message:
      'Name must start with a capital letter and contain only letters, spaces, and hyphens!',
  })
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[A-Z][a-z]+(?:[ -][A-Z][a-z]+)*$/, {
    message:
      'Surname must start with a capital letter and contain only letters, spaces, and hyphens!',
  })
  surname: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*\d)/, { message: 'The password is too weak!' })
  password: string;
}
