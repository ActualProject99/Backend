import { Module } from '@nestjs/common';
import { ConcertlikeController } from './concertlike.controller';
import { ConcertlikeService } from './concertlike.service';

@Module({
  controllers: [ConcertlikeController],
  providers: [ConcertlikeService]
})
export class ConcertlikeModule {}
