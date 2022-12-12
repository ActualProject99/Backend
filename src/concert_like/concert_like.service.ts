import { Injectable } from '@nestjs/common';
import { ConcertLike } from 'src/entities/concert_like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ConcertLikeService {
  constructor(
    @InjectRepository(ConcertLike)
    private readonly concertLikeRepository: Repository<ConcertLike>,
  ) {}

  // 좋아요 여부
  async existConcertLike(concertId: number, userId: number) {
    const existLike: object = await this.concertLikeRepository.findOne({
      where: { concertId, userId },
    });
    return existLike;
  }

  // 좋아요 추가
  async createConcertLike(concertId: number, userId: number) {
    const concertlike = new ConcertLike();
    concertlike.concertId = concertId;
    concertlike.userId = userId;

    return this.concertLikeRepository.save(concertlike);
  }

  // 좋아요 삭제
  async deleteConcertLike(concertId: number, userId: number): Promise<any> {
    const existLike = await this.concertLikeRepository.findOne({
      where: { concertId, userId },
    });
    if (existLike) {
      return this.concertLikeRepository.remove(existLike);
    }
  }

  // 마이페이지 좋아요한 콘서트 조회
  find(userId: number): Promise<ConcertLike[]> {
    return this.concertLikeRepository.find({ where: { userId } });
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
