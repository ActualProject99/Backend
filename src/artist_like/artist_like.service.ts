import { Injectable } from '@nestjs/common';
import { ArtistLike } from '../entities/artist_like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistlikeService {
  constructor(
    @InjectRepository(ArtistLike)
    private readonly artistLikeRepository: Repository<ArtistLike>,
  ) {}

  async existLike(artistId: number, userId: number) {
    const existLike: object = await this.artistLikeRepository.findOne({
      where: { artistId, userId },
    });

    return existLike;
  }

  async createArtistLike(artistId: number, userId: number) {
    const artistlike = new ArtistLike();
    artistlike.artistId = artistId;
    artistlike.userId = userId;

    return this.artistLikeRepository.save(artistlike);
  }

  async deleteArtistLike(artistId: number, userId: number): Promise<any> {
    const existLike = await this.artistLikeRepository.findOne({
      where: { artistId, userId },
    });
    if (existLike) {
      return this.artistLikeRepository.remove(existLike);
    }
  }

  async find(userId: number) {
    await this.artistLikeRepository.find({ where: { userId } });
  }

  // 아티스트 상세 좋아요 조회
  async getLike(artistId: number, userId: number) {
    const getLike = await this.artistLikeRepository.findOne({
      where: { userId, artistId },
    });

    if (getLike) {
      return { isLike: true };
    } else {
      return { isLike: false };
    }
  }
}
