import { Module } from '@nestjs/common';
import { ConcertlikeController } from './concert_like.controller';
import { ConcertlikeService } from './concert_like.service';

@Module({
  controllers: [ConcertlikeController],
  providers: [ConcertlikeService],
})
export class ConcertlikeModule {}
