import { SocketSchema, Socket as SocketModel } from '../entities/sockets.entity';
import { Chatting, ChattingSchema } from '../entities/chattings.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: SocketModel.name, schema: SocketSchema },
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
