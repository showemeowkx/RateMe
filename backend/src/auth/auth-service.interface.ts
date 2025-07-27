import { AuthSignInCredDto } from './dto/auth-sign-in.dto';
import { AuthSignUpCredDto } from './dto/auth-sign-up.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { User } from './user.entity';

export interface AuthServiceInterface {
  getUsers(filterDto: GetUsersFilterDto): Promise<User[]>;

  getUserById(userId: string): Promise<User>;

  getProfileInfo(user: User): Promise<User>;

  createUser(authSignUpCredDto: AuthSignUpCredDto): Promise<void>;

  signIn(
    authSignInCredDto: AuthSignInCredDto,
  ): Promise<{ accessToken: string }>;

  setModeratorStatus(userId: string): Promise<void>;

  updateCredentials(
    user: User,
    updateCredentialsDto: UpdateCredentialsDto,
    file: Express.Multer.File,
  ): Promise<{ accessToken: string }>;

  deleteUser(toDelete: string | User): Promise<void>;
}
