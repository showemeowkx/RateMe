import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInCredDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
