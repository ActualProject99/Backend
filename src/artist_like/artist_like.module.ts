import { ArtistLike } from '../entities/artist_like.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistlikeController } from './artist_like.controller';
import { ArtistlikeService } from './artist_like.service';
import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ArtistLike, Artist, User])],
  controllers: [ArtistlikeController],
  providers: [ArtistlikeService],
  exports: [TypeOrmModule],
})
export class ArtistlikeModule {}
