import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authSignUpCredDto: AuthSignUpCredDto): Promise<void> {
    this.logger.verbose(
      `Creating an account... {username: ${authSignUpCredDto.username}}`,
    );
    return this.authService.createUser(authSignUpCredDto);
  }

  @Post('/signin')
  signIn(@Body() authSignInCredDto: AuthSignInCredDto): Promise<User> {
    this.logger.verbose(`Signing in... {login: ${authSignInCredDto.login}}`);
    return this.authService.signIn(authSignInCredDto);
  }
}
