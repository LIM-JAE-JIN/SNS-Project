import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('/posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  /**
   * 1) Entity 생성
   * author -> 작성자
   * post -> 귀속되는 포스트
   * comment -> 실제 댓글 내용
   * likeCount -> 좋아요 갯수
   *
   * id -> PrimaryGeneratedColumn
   * createdAt -> 생성일자
   * updatedAt -> 업데이트일자
   *
   * 2) GET() pagination
   * 3) GET(':commentId') 특정 comment만 하나 가져오는 기능
   * 4) POST() 코멘트 생성하는 기능
   * 5) PATCH(':commentId') 특정 comment 업데이트 하는 기능
   * 6) DELETE(':commentId') 특정 comment 삭제하는 기능
   */

  @Get()
  getComments(
    @Param('postId') postId: number,
    @Query() query: BasePaginationDto,
  ) {
    return this.commentsService.paginateComments(postId, query);
  }

  @Get('/:id')
  getCommnetById(@Param('id') id: number) {
    return this.commentsService.getCommentById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  createComment(
    @Param('postId') postId: number,
    @Body() body: CreateCommentDto,
    @User() author: UsersModel,
  ) {
    return this.commentsService.createComment(postId, body, author);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  patchComment(@Param('id') id: number, @Body() body: UpdateCommentDto) {
    return this.commentsService.updateComment(id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteComment(@Param('id') id: number) {
    return this.commentsService.deleteComment(id);
  }
}
