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

@Injectable()
export class AuthService {
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
      const users = await query.getMany();
      return users;
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

  async createUser(authSignInCredDto: AuthSignUpCredDto): Promise<void> {
    const { name, surname, username, email, password } = authSignInCredDto;

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
}
