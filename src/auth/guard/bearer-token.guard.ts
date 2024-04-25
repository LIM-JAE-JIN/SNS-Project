import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';
import { IsPublicEnum } from 'src/users/const/is-public.const';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const requiredPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredPublic) {
      req.isRoutePublic = requiredPublic;
    }

    if (requiredPublic === IsPublicEnum.ISPUBLIC) {
      return true;
    }

    const rawToken = req.headers['authorization'];

    if (!rawToken) throw new UnauthorizedException('토큰이 없습니다!');

    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const result = await this.authService.verifyToken(token);

    /**
     * 1) 사용자 정보 - user
     * 2) token - token
     * 3) tokenType - access | refresh
     */
    const user = await this.usersService.getUserByEmail(result.email);

    req.user = user;
    req.token = token;
    req.tokenType = result.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (
      req.isRoutePublic === IsPublicEnum.ISPUBLIC ||
      IsPublicEnum.ISREFRESHTOKEN
    ) {
      return true;
    }

    if (req.tokenType !== 'access')
      throw new UnauthorizedException('Access Token이 아닙니다.');

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'refresh')
      throw new UnauthorizedException('Refresh Token이 아닙니다.');

    return true;
  }
}
