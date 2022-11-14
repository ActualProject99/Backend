import { Concert } from '../entities/concert.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';

@Module({
  imports: [TypeOrmModule.forFeature([Concert])],
  controllers: [ConcertController],
  providers: [ConcertService],
})
export class ConcertModule {}
