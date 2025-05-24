import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { setStorageOptions } from 'src/common/file-upload';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { StreamifyInterceptor } from 'src/common/interceptors/streamify.interceptor';
const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  @UseInterceptors(StreamifyInterceptor)
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    this.logger.verbose(
      `Getting users... {filters" ${JSON.stringify(filterDto)}}`,
    );
    return this.authService.getUsers(filterDto);
  }

  @Get('/:userId')
  @UseGuards(AuthGuard())
  getUserById(@Param('userId') userId: string): Promise<User> {
    this.logger.verbose(`Getting user by id... {userId: ${userId}}`);
    return this.authService.getUserById(userId);
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

  @Patch('/pfp')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor(
      'file',
      setStorageOptions('user-images', allowedExtensions),
    ),
  )
  updatePfp(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    this.logger.verbose(
      `Updating a profile picture... {username: ${user.username}}`,
    );
    return this.authService.updatePfp(user, file);
  }

  @Patch('moderator')
  @UseGuards(AuthGuard())
  setModeratorStatus(@GetUser() user: User): Promise<void> {
    this.logger.verbose(
      `Setting moderator status... {username: ${user.username}}`,
    );
    return this.authService.setModeratorStatus(user);
  }

  @Patch('/update-credentials')
  @UseGuards(AuthGuard())
  updateCredentials(
    @GetUser() user: User,
    @Body() updateCredentialsDto: UpdateCredentialsDto,
  ): Promise<{ accessToken }> {
    this.logger.verbose(`Updating credentials... {username: ${user.username}}`);
    return this.authService.updateCredentials(user, updateCredentialsDto);
  }
}
