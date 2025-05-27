import { Injectable, Logger } from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';

@Injectable()
export class AuthProxy {
  private logger = new Logger('AuthProxy');
  constructor(private authService: AuthService) {}

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    this.logger.verbose(
      `Getting users with... {filters: ${JSON.stringify(filterDto)}}`,
    );
    return this.authService.getUsers(filterDto);
  }

  async getUserById(userId: string): Promise<User> {
    this.logger.verbose(`Getting user by id... {userId: ${userId}}`);
    return this.authService.getUserById(userId);
  }

  async createUser(authSignUpCredDto: AuthSignUpCredDto): Promise<void> {
    this.logger.verbose(
      `Creating a user... {username: ${authSignUpCredDto.username}}`,
    );
    return this.authService.createUser(authSignUpCredDto);
  }

  async signIn(authSignInCredDto: AuthSignInCredDto): Promise<{ accessToken }> {
    this.logger.verbose(`Signing in... {login: ${authSignInCredDto.login}}`);
    return this.authService.signIn(authSignInCredDto);
  }

  async updatePfp(user: User, file: Express.Multer.File): Promise<void> {
    this.logger.verbose(
      `Updating profile picture... {username: ${user.username}}`,
    );
    return this.authService.updatePfp(user, file);
  }

  async setModeratorStatus(user: User): Promise<void> {
    this.logger.verbose(
      `Setting moderator status... {username: ${user.username}`,
    );
    return this.authService.setModeratorStatus(user);
  }

  async updateCredentials(
    user: User,
    updateCredentialsDto: UpdateCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`Updating credentials... {username: ${user.username}}`);
    return this.authService.updateCredentials(user, updateCredentialsDto);
  }
}
