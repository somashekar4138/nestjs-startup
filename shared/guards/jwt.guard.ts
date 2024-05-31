import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err) {
      // Handle specific Passport errors (e.g., JWT expired)
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('JWT token has expired.');
      } else if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid JWT token.');
      } else {
        // General unauthorized error
        throw new UnauthorizedException(info?.message || 'Unauthorized');
      }
    }

    if (!user) {
      // Throw error if no user is provided
      throw new UnauthorizedException('No user found with this JWT token.');
    }

    return user;
  }
}
