import { Injectable, Response } from '@nestjs/common';
import { ConcertLike } from 'src/entities/concert_like.entity'; 
import { Concert } from 'src/entities/concert.entity';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { throwError } from 'rxjs';
import * as dayjs from 'dayjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateConcertLikeDto } from './dto/create.concert_like.dto';

@Injectable()
export class ConcertLikeService {
  constructor(
    @InjectRepository(ConcertLike)
    private readonly concertLikeRepository: Repository<ConcertLike>,
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async existConcertLike(concertId: number, userId: number) {
    const existLike = await this.concertLikeRepository.findOne({
      where: { concertId, userId },
    });
    return existLike;
  }

  async createConcertLike(concertId: number, userId: number) {
    const concertlike = new ConcertLike();
    concertlike.concertId = concertId;
    concertlike.userId = userId;

    return this.concertLikeRepository.save(concertlike);
  }

  async deleteConcertLike(concertId: number, userId: number): Promise<any> {
    const existLike = await this.concertLikeRepository.findOne({
      where: { concertId, userId },
    });
    if (existLike) {
      return this.concertLikeRepository.remove(existLike);
    }
  }

  // // 특정 유저 좋아요 조회
  // async find(userId: number) {
  //   const concert = await this.concertRepository.find();
  //   concert.forEach((a) => console.log(a.concertId));

  //   const existLike = await this.concertRepository.find({
  //     where: { userId },
  //   });
  //   existLike.forEach((b) => console.log(b.concertId));
  //   // return existLike.map((a) => a.artistId === artist) ? { artistId: artistId, isLike: true } : { artistId: artistId, isLike: false }
  // }

  async find(userId: number) {
    const existLike = await this.concertLikeRepository.find({
      where: { userId },
    });

    return existLike;
  }

  // 아티스트 상세 좋아요 조회
  async getLike(concertId: number, userId: number) {
    const getLike = await this.concertLikeRepository.findOne({
      where: { userId, concertId },
    });

    if (getLike) {
      return { isLike: true };
    } else {
      return { isLike: false };
    }
  }
}