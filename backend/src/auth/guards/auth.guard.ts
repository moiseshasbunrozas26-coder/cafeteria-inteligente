import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UsersService } from '../../users/users.service.js';

type JwtPayload = {
  sub: number;
  email: string;
  role: 'ADMIN' | 'STAFF';
};

type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Debes iniciar sesión para acceder.',
      );
    }

    let payload: JwtPayload;

    try {
      payload =
        await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException(
        'El token es inválido o ha expirado.',
      );
    }

    const currentUser =
      await this.usersService.findForAuth(payload.sub);

    if (!currentUser || !currentUser.active) {
      throw new UnauthorizedException(
        'La cuenta está desactivada o ya no existe.',
      );
    }

    request.user = {
      sub: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    };

    return true;
  }

  private extractTokenFromHeader(
    request: Request,
  ): string | undefined {
    const [type, token] =
      request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}