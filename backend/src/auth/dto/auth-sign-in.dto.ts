import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthSignInCredDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  login: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
