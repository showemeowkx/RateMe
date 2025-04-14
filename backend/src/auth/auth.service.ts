import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { AuthSignInCredDto } from './dto/auth-sign-in.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });
  @InjectRepository(User) private userRepository: Repository<User>;

  async createUser(authSignInCredDto: AuthSignUpCredDto): Promise<void> {
    const { name, surname, username, email, password } = authSignInCredDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      isModerator: false,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        this.logger.error(
          `[ALREADY EXISTS] Failed to create a user {username: ${username}}`,
        );
        throw new ConflictException('This user already exists');
      } else {
        this.logger.error(
          `[INTERNAL] Failed to create a user {username: ${username}}`,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authSignInCredDto: AuthSignInCredDto): Promise<User> {
    const { login, password } = authSignInCredDto;
    const user = await this.userRepository.findOneBy([
      { username: login },
      { email: login },
    ]);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      this.logger.error(`[WRONG INPUT] Failed to sign in {login: ${login}}`);
      throw new UnauthorizedException('Wrong login or password!');
    }
  }
}
