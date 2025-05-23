import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ModeratorGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user || user.isModerator !== true) {
      throw new UnauthorizedException(
        'Access denied: Moderator privileges required',
      );
    }

    return true;
  }
}
