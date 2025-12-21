import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { AuthService } from './auth.service';
import { ModeratorGuard } from 'src/common/decorators/guards/moderator.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    return this.authService.getUsers(filterDto);
  }

  @Get('id/:userId')
  @UseGuards(AuthGuard())
  getUserById(@Param('userId') userId: string): Promise<User> {
    return this.authService.getUserById(userId);
  }

  @Get('/profile')
  @UseGuards(AuthGuard())
  async getMyInfo(@GetUser() user: User): Promise<User> {
    return this.authService.getProfileInfo(user);
  }

  @Post('/signup')
  signUp(@Body() authSignUpCredDto: AuthSignUpCredDto): Promise<void> {
    return this.authService.createUser(authSignUpCredDto);
  }

  @Post('/signin')
  signIn(
    @Body() authSignInCredDto: AuthSignInCredDto,
  ): Promise<{ accessToken }> {
    return this.authService.signIn(authSignInCredDto);
  }

  @Patch('/update-credentials')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  updateCredentials(
    @GetUser() user: User,
    @Body() updateCredentialsDto: UpdateCredentialsDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ accessToken: string }> {
    return this.authService.updateCredentials(user, updateCredentialsDto, file);
  }

  @Delete('id/:userId')
  @UseGuards(ModeratorGuard)
  deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.authService.deleteUser(userId);
  }

  @Delete('/profile')
  @UseGuards(AuthGuard())
  deleteAccount(@GetUser() user: User): Promise<void> {
    return this.authService.deleteUser(user);
  }
}
