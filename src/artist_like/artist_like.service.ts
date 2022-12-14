import { Injectable, Response } from '@nestjs/common';
import { ArtistLike } from '../entities/artist_like.entity';
import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { throwError } from 'rxjs';
import * as dayjs from 'dayjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateArtistlikeDto } from './dto/create-artist_like.dto';

@Injectable()
export class ArtistlikeService {
  constructor(
    @InjectRepository(ArtistLike)
    private readonly artistLikeRepository: Repository<ArtistLike>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async existLike(artistId: number, userId: number) {
    const existLike = await this.artistLikeRepository.findOne({
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

  // // 특정 유저 좋아요 조회 ver.2
  // async find(userId: number) {
  //   const artist = await this.artistRepository.find();
  //   artist.forEach((a) => console.log(a.artistId));

  //   const existLike = await this.artistLikeRepository.find({
  //     where: { userId },
  //   });
  //   existLike.forEach((b) => console.log(b.artistId));
  //   // return existLike.map((a) => a.artistId === artist) ? { artistId: artistId, isLike: true } : { artistId: artistId, isLike: false }
  // }

  async find(userId: number) {
    const existLike = await this.artistLikeRepository.find({
      where: { userId },
    });

    return existLike;
  }

  // 아티스트 상세 좋아요 조회
  async getLike(artistId: number, userId: number) {
    const getLike = await this.artistLikeRepository.findOne({
      where: { artistId, userId },
    });

    if (getLike) {
      return { isLike: true };
    } else {
      return { isLike: false };
    }
  }
}
