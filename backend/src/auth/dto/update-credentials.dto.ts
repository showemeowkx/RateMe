import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// TODO: fix duplication of auth-sign-up.dto.ts
export class UpdateCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ']+(?:[ -][A-ZА-ЯІЇЄҐ][a-zа-яіїєґ']+)*$/, {
    message: 'Name must start with a capital letter and contain only letters!',
  })
  name?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ']+(?:[ -][A-ZА-ЯІЇЄҐ][a-zа-яіїєґ']+)*$/, {
    message:
      'Surname must start with a capital letter and contain only letters!',
  })
  surname?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^(?=.*[a-z])(?=.*\d)/, { message: 'The password is too weak!' })
  password?: string;
}
