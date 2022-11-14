import { ArtistLike } from '../entities/artistlike.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistlikeController } from './artistlike.controller';
import { ArtistlikeService } from './artistlike.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistLike])],
  controllers: [ArtistlikeController],
  providers: [ArtistlikeService],
})
export class ArtistlikeModule {}
