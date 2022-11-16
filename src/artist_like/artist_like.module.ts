import { ArtistLike } from '../entities/artist_like.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistlikeController } from './artist_like.controller';
import { ArtistlikeService } from './artist_like.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistLike])],
  controllers: [ArtistlikeController],
  providers: [ArtistlikeService],
})
export class ArtistlikeModule {}
