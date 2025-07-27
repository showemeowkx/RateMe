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

  async setModeratorStatus(userId: string): Promise<void> {
    this.cache.flushAll();
    this.logger.verbose(`Setting moderator status... {userId: ${userId}}`);
    return this.authService.setModeratorStatus(userId);
  }

  async updateCredentials(
    user: User,
    updateCredentialsDto: UpdateCredentialsDto,
    file: Express.Multer.File,
  ): Promise<{ accessToken: string }> {
    this.cache.flushAll();
    this.logger.verbose(`Updating credentials... {username: ${user.username}}`);
    return this.authService.updateCredentials(user, updateCredentialsDto, file);
  }

  async deleteUser(toDelete: string | User): Promise<void> {
    const userId = typeof toDelete === 'string' ? toDelete : toDelete.id;
    this.cache.flushAll();
    this.logger.verbose(`Deleting a user... {userId: ${userId}}`);
    return this.authService.deleteUser(toDelete);
  }
}
