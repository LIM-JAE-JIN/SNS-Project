import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SocketBearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();

    const headers = socket.handshake.headers;

    // Bearer XXXXXX
    const rawToken = headers['authorization'];

    if (!rawToken) throw new WsException('토큰이 없습니다!');

    // 해당 서비스들의 로직들은 http관련 에러를 던지고 있기 때문에 try catch로 ws에러를 던져줌
    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const payload = this.authService.verifyToken(token);

      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;
      socket.token = token;
      socket.tokenType = payload.tokenType;

      return true;
    } catch (e) {
      throw new WsException('토큰이 유효하지 않습니다.');
    }
  }
}
