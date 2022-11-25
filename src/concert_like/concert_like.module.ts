import { ConcertLike } from 'src/entities/concert_like.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertlikeController } from './concert_like.controller';
import { ConcertlikeService } from './concert_like.service';
import { Concert } from 'src/entities/concert.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertLike, Concert, User])],
  controllers: [ConcertlikeController],
  providers: [ConcertlikeService],
  exports: [TypeOrmModule],
})
export class ConcertlikeModule {}
