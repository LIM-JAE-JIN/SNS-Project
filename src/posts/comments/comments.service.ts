import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entities/comments.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginateCommentDto } from './dto/paginate-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    private readonly commonService: CommonService,
  ) {}

  paginateComments(postId: number, dto: PaginateCommentDto) {
    return this.commonService.paginate(
      dto,
      this.commentsRepository,
      {
        ...DEFAULT_COMMENT_FIND_OPTIONS,
        where: {
          post: { id: postId },
        },
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(id: number) {
    const comment = await this.commentsRepository.findOne({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: { id },
    });

    if (!comment)
      throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);

    return comment;
  }

  async createComment(
    postId: number,
    dto: CreateCommentDto,
    author: UsersModel,
  ) {
    const comment = await this.commentsRepository.save({
      comment: dto.comment,
      post: { id: postId },
      author,
    });

    return comment;
  }

  async updateComment(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');

    const prevComment = await this.commentsRepository.preload({
      id,
      ...dto,
    });

    const newComment = await this.commentsRepository.save(prevComment);

    return newComment;
  }

  async deleteComment(id: number) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');

    await this.commentsRepository.delete(id);

    return id;
  }
}
