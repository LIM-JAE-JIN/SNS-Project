import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesModel } from './entities/messages.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginateChatDto } from 'src/chats/dto/paginate-chat.dto';
import { CreateMessagesDto } from './dto/create-messges.dto';

@Injectable()
export class ChatsMessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: CreateMessagesDto, authorId: number) {
    const message = await this.messagesRepository.save({
      chat: {
        id: dto.chatId,
      },
      author: {
        id: authorId,
      },
      message: dto.message,
    });

    return await this.messagesRepository.findOne({
      where: {
        id: message.id,
      },
      relations: { chat: true },
    });
  }

  paginateMessages(
    dto: PaginateChatDto,
    overrideFindOptions: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.paginate(
      dto,
      this.messagesRepository,
      overrideFindOptions,
      'messages',
    );
  }
}
