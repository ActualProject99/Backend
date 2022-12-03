import { ConcertLike } from 'src/entities/concert_like.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertLikeController } from './concert_like.controller';
import { ConcertLikeService } from './concert_like.service';
import { Concert } from 'src/entities/concert.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertLike, Concert, User])],
  controllers: [ConcertLikeController],
  providers: [ConcertLikeService],
  exports: [TypeOrmModule],
})
export class ConcertlikeModule {}
