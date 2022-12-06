import { Concert } from '../entities/concert.entity';
import { ConcertService } from '../concert/concert.service';
import { Artist } from '../entities/artist.entity';
import { hotConcert } from '../entities/hot_concert.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Concert])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ArtistModule {}
