import { Module } from '@nestjs/common';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';

@Module({
  controllers: [ConcertController],
  providers: [ConcertService],
})
export class ConcertModule {}
