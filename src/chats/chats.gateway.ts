import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connect called ${socket.id}`);
  }

  @SubscribeMessage('create_chat')
  createChat(
    @MessageBody() date: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {}

  @SubscribeMessage('enter_chat')
  enterChat(
    // 방의 chat ID들을 리스트로 받는다
    @MessageBody() data: number[],
    @ConnectedSocket() socket: Socket,
  ) {
    for (const chatId of data) {
      // socket.join()
      socket.join(chatId.toString());
    }
  }

  // socket.on('send_message', (message)=> console.log(message));
  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() message: { message: string; chatId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    // 현재 연결된 소켓
    socket
      .to(message.chatId.toString())
      .emit('receive_message', message.message);

    // 서버 전체
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', message.message);
  }
}
