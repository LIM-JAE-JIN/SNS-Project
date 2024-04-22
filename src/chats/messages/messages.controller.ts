import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatsMessagesService } from './messages.service';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

@Controller('chats/:cid/messages')
export class MessagesController {
  constructor(private readonly messagesService: ChatsMessagesService) {}

  @Get()
  paginateMessage(@Param('cid') id: number, @Query() dto: BasePaginationDto) {
    return this.messagesService.paginateMessages(dto, {
      where: { chat: { id } },
      relations: {
        chat: true,
        author: true,
      },
    });
  }
}
