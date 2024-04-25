import {
  Body,
  Controller,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  MaxLengthPipe,
  MinLengthPipe,
  PasswordPipe,
} from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsPublicEnum } from 'src/users/const/is-public.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic(IsPublicEnum.ISREFRESHTOKEN)
  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    /**
     * {accessToken: {token}}
     */
    return {
      accessToken: newToken,
    };
  }

  @IsPublic(IsPublicEnum.ISREFRESHTOKEN)
  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    /**
     * {refreshToken: {token}}
     */
    return {
      refreshToken: newToken,
    };
  }

  @IsPublic(IsPublicEnum.ISPUBLIC)
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    // email:password -> base64
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @IsPublic(IsPublicEnum.ISPUBLIC)
  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }
}
