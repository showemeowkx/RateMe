import { Injectable, Logger } from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './user.entity';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { AuthServiceInterface } from './auth-service.interface';
import { AuthService } from './auth.service';
import * as NodeCache from 'node-cache';

@Injectable()
export class AuthProxy implements AuthServiceInterface {
  private logger = new Logger('AuthProxy');
  private cache = new NodeCache({ stdTTL: 600 });

  constructor(private authService: AuthService) {}

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const cacheKey = JSON.stringify(filterDto);
    const cachedUsers = this.cache.get<User[]>(cacheKey);
    if (cachedUsers) {
      this.logger.verbose(
        `[CACHED] Getting users with... {filters: ${JSON.stringify(filterDto)}}`,
      );
      return cachedUsers;
    }
    this.logger.verbose(
      `Getting users with... {filters: ${JSON.stringify(filterDto)}}`,
    );
    const users = await this.authService.getUsers(filterDto);
    this.cache.set(cacheKey, users);
    return users;
  }

  async getUserById(userId: string): Promise<User> {
    this.logger.verbose(`Getting user by id... {userId: ${userId}}`);
    return this.authService.getUserById(userId);
  }

  async getProfileInfo(user: User): Promise<User> {
    this.logger.verbose(`Getting profile info... {username: ${user.username}}`);
    return this.authService.getProfileInfo(user);
  }

  async createUser(authSignUpCredDto: AuthSignUpCredDto): Promise<void> {
    this.cache.flushAll();
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
    this.cache.flushAll();
    this.logger.verbose(
      `Updating profile picture... {username: ${user.username}}`,
    );
    return this.authService.updatePfp(user, file);
  }

  async setModeratorStatus(user: User): Promise<void> {
    this.cache.flushAll();
    this.logger.verbose(
      `Setting moderator status... {username: ${user.username}`,
    );
    return this.authService.setModeratorStatus(user);
  }

  async updateCredentials(
    user: User,
    updateCredentialsDto: UpdateCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.cache.flushAll();
    this.logger.verbose(`Updating credentials... {username: ${user.username}}`);
    return this.authService.updateCredentials(user, updateCredentialsDto);
  }
}
