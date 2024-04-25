import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RolesEnum } from 'src/users/const/roles.const';
import { CommentsService } from '../comments.service';
import { Request } from 'express';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;

    if (!user)
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');

    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const commentId = req.params.id;

    if (!commentId)
      throw new BadRequestException('Post ID가 파라미터로 제공 되어야합니다.');

    const checkUser = await this.commentsService.isCommentMine(
      user.id,
      parseInt(commentId),
    );

    if (!checkUser) throw new ForbiddenException('권한이 없습니다.');

    return true;
  }
}
