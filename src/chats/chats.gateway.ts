import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messges.dto';
import { ChatsMessagesService } from './messages/messages.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from 'src/common/exception-filter/socket-catch-http.exception-filter';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: ChatsMessagesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  // 게이트웨이가 초기화 됐을 때,
  afterInit(server: any) {
    console.log(`after gateway init`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`on disconnect called : ${socket.id}`);
  }

  async handleConnection(socket: Socket & { user: UsersModel }) {
    console.log(`on connect called ${socket.id}`);

    const headers = socket.handshake.headers;

    const rawToken = headers['authorization'];

    if (!rawToken) {
      // throw new WsException('토큰이 없습니다!');
      socket.disconnect();
    }

    // 해당 서비스들의 로직들은 http관련 에러를 던지고 있기 때문에 try catch로 ws에러를 던져줌
    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const payload = this.authService.verifyToken(token);

      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;

      return true;
    } catch (e) {
      // throw new WsException('토큰이 유효하지 않습니다.');
      socket.disconnect();
    }
  }

  // main.ts에 있는 글로벌파이프는 restapi에만 적용되기 때문에 ws에서 따로 각각의 이벤트명에 넣어줘야함..
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  // exception-filter로 벨리데이터 ws에 맞춰 변경
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chat = await this.chatsService.createChat(data);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists)
        throw new WsException({
          code: 100,
          message: `존재하지 않는 chat입니다. chatId: ${chatId}`,
        });
    }

    // socket.join()
    socket.join(data.chatIds.map((x) => x.toString()));
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  // socket.on('send_message', (message)=> console.log(message));
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExists)
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat Id : ${dto.chatId}`,
      );

    const message = await this.messagesService.createMessage(
      dto,
      socket.user.id,
    );

    // 현재 연결된 소켓
    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);

    // 서버 전체
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', message.message);
  }
}
