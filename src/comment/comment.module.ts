import { Artist } from './../entities/artist.entity';
import { hotConcert } from './../entities/hot_concert.entity';
import { ConcertService } from './../concert/concert.service';
import { Concert } from './../entities/concert.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Concert, hotConcert, Artist])],
  controllers: [CommentController],
  providers: [CommentService, ConcertService],
})
export class CommentModule {}
