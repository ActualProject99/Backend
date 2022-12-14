import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from '../entities/concert.entity';
import { hotConcert } from '../entities/hot_concert.entity';
import { Artist } from '../entities/artist.entity';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, hotConcert, Artist])],
  controllers: [ConcertController],
  providers: [ConcertService],
})
export class ConcertModule {}
