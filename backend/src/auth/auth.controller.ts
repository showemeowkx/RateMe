import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    this.logger.verbose(
      `Getting users... {filters" ${JSON.stringify(filterDto)}}`,
    );
    return this.authService.getUsers(filterDto);
  }

  @Post('/signup')
  signUp(@Body() authSignUpCredDto: AuthSignUpCredDto): Promise<void> {
    this.logger.verbose(
      `Creating an account... {username: ${authSignUpCredDto.username}}`,
    );
    return this.authService.createUser(authSignUpCredDto);
  }

  @Post('/signin')
  signIn(
    @Body() authSignInCredDto: AuthSignInCredDto,
  ): Promise<{ accessToken }> {
    this.logger.verbose(`Signing in... {login: ${authSignInCredDto.login}}`);
    return this.authService.signIn(authSignInCredDto);
  }
}
