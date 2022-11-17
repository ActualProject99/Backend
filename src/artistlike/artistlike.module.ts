import { Module } from '@nestjs/common';
import { ArtistlikeController } from './artistlike.controller';
import { ArtistlikeService } from './artistlike.service';

@Module({
  controllers: [ArtistlikeController],
  providers: [ArtistlikeService],
})
export class ArtistlikeModule {}
