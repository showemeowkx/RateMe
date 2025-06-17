/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import * as fs from 'fs/promises';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { AuthServiceInterface } from './auth-service.interface';
import { getPrimaryPath, getRealPath } from 'src/common/file-upload';

@Injectable()
export class AuthService implements AuthServiceInterface {
  private logger = new Logger('AuthService', { timestamp: true });
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { name, username, email } = filterDto;

    const query = this.userRepository.createQueryBuilder('user');

    if (name) {
      query.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (username) {
      query.andWhere('LOWER(user.username) LIKE LOWER(:username)', {
        username: `%${username}%`,
      });
    }

    if (email) {
      query.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
        email: `%${email}%`,
      });
    }

    query
      .leftJoinAndSelect('user.reviews', 'reviews')
      .leftJoinAndSelect('user.items', 'items');

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get users {filters: ${JSON.stringify(filterDto)}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reviews', 'items'],
    });

    if (!user) {
      this.logger.error(
        `[NOT FOUND] Failed to get a user... {userId: ${userId}}`,
      );
      throw new NotFoundException(`User with id ${userId} was not found`);
    }

    return user;
  }

  async getProfileInfo(user: User): Promise<User> {
    try {
      return this.getUserById(user.id);
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get profile info... {username: ${user.username}}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async createUser(authSignUpCredDto: AuthSignUpCredDto): Promise<void> {
    const { name, surname, username, email, password } = authSignUpCredDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      imagePath: 'uploads/defaults/user_default.jpg',
      name: `${name.trim()} ${surname.trim()}`,
      username,
      email,
      password: hashedPassword,
      isModerator: false,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(
          `[ALREADY EXISTS] Failed to create a user {username: ${username}}`,
        );
        throw new ConflictException('This user already exists');
      } else {
        this.logger.error(
          `[INTERNAL] Failed to create a user {username: ${username}}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authSignInCredDto: AuthSignInCredDto): Promise<{ accessToken }> {
    const { login, password } = authSignInCredDto;
    const user = await this.userRepository.findOneBy([
      { username: login },
      { email: login },
    ]);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { login, isModerator: user.isModerator };
      const accessToken: string = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      this.logger.error(`[WRONG INPUT] Failed to sign in {login: ${login}}`);
      throw new UnauthorizedException('Wrong login or password!');
    }
  }

  // way too simple. will be reworked later
  async setModeratorStatus(user: User): Promise<void> {
    try {
      await this.userRepository.update(user.id, { isModerator: true });
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to set moderator status {username: ${user.username}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async updatePfp(user: User, file: Express.Multer.File): Promise<void> {
    const oldImagePath = user.imagePath;
    const newImagePath = file?.path;

    if (!newImagePath) {
      this.logger.error(
        `[FILE ERROR] Failed to update a profile picture {username: ${user.username}}`,
      );
      throw new InternalServerErrorException();
    }

    try {
      await this.userRepository.update(user.id, {
        imagePath: getPrimaryPath(newImagePath),
      });
      if (oldImagePath !== 'uploads/defaults/user_default.jpg') {
        const realOldImagePath = getRealPath(oldImagePath);
        await fs.unlink(realOldImagePath);
      }
    } catch (error) {
      await fs.unlink(newImagePath);
      this.logger.error(
        `[INTERNAL] Failed to update a profile picture... {username: ${user.username}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async checkLogin(
    value: string,
    originalValue: string,
    cred: 'username' | 'email',
  ): Promise<string> {
    if (value === originalValue) {
      throw new ConflictException(
        this.logger.error(
          `[SAME INPUT] Failed to update credentials {${cred}: ${originalValue}}}`,
        ),
        `New ${cred} must be different from current one`,
      );
    }

    const sameUsers = await this.getUsers({ [cred]: value });
    for (const sameUser of sameUsers) {
      if (sameUser[cred] === value) {
        this.logger.error(
          `[ALREADY EXISTS] Failed to update credentials {${cred}: ${originalValue}}`,
        );
        throw new ConflictException(`This ${cred} is already taken`);
      }
    }

    return value;
  }

  async updateCredentials(
    user: User,
    updateCredentialsDto: UpdateCredentialsDto,
    file: Express.Multer.File,
  ): Promise<{ accessToken }> {
    const { name, surname, username, password, email } = updateCredentialsDto;
    let newLogin: string = user.username;
    let newPassword: string = user.password;
    let newName: string = user.name;

    if (name) {
      const nameSplit = newName.split(' ');
      newName = `${name.trim()} ${nameSplit[1]}`;
    }

    if (surname) {
      const nameSplit = newName.split(' ');
      newName = `${nameSplit[0]} ${surname.trim()}`;
    }

    if (username) {
      newLogin = await this.checkLogin(username, user.username, 'username');
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      newPassword = hashedPassword;
    }

    if (email) {
      newLogin = await this.checkLogin(email, user.email, 'email');
    }

    if (file) {
      await this.updatePfp(user, file);
    }

    try {
      await this.userRepository.update(user.id, {
        username: username ?? user.username,
        email: email ?? user.email,
        password: newPassword,
        name: newName,
      });
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to update credentials {username: ${user.username}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    const payload: JwtPayload = {
      login: newLogin,
      isModerator: user.isModerator,
    };
    const accessToken: string = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async deleteUser(toDelete: string | User): Promise<void> {
    const userId = typeof toDelete === 'string' ? toDelete : toDelete.id;
    const user =
      typeof toDelete === 'string' ? await this.getUserById(userId) : toDelete;
    try {
      const imagePath = getRealPath(user.imagePath);
      const itemsImagePaths = user['items'].map((item) =>
        getRealPath(item.imagePath),
      );
      await this.userRepository
        .remove(user)
        .then(async () => {
          if (user.imagePath !== 'uploads/defaults/user_default.jpg') {
            await fs.unlink(imagePath);
          }
        })
        .then(async () => {
          for (const imagePath of itemsImagePaths) {
            await fs.unlink(imagePath);
          }
        });
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to delete a user {userId: ${userId}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
