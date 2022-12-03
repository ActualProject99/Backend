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
    if (existLike) {
      return { isLike: true };
    } else {
      return { isLike: false };
    }
  }

  async createArtistLike(artistId: number, userId: number) {
    const artistlike = new ArtistLike();
    artistlike.artistId = artistId;
    artistlike.userId = userId;

    return this.artistLikeRepository.save(artistlike);
  }

  // 유저의 likeArtist에서 artistId 생성
  async createLikeArtist(artistId: number, userId: number) {
    const createLikeArtist =
      /*new User();*/
      await this.userRepository.findOne({ where: { userId } });
    createLikeArtist.likeArtist = artistId;

    return this.userRepository.save(createLikeArtist);
  }

  async deleteArtistLike(artistId: number, userId: number): Promise<any> {
    const existLike = await this.artistLikeRepository.findOne({
      where: { artistId, userId },
    });
    if (existLike) {
      return this.artistLikeRepository.remove(existLike);
    }
  }

  // 유저의 likeArtist에서 artistId 삭제
  async deleteLikeArtist(artistId: number, userId: number) {
    const deleteLikeArtist: any = await this.userRepository.findOne({
      where: { userId },
    });
    const likeArtist: any = await deleteLikeArtist.likeArtist.findOne({
      where: { artistId },
    });
    if (likeArtist) {
      return this.userRepository.remove(likeArtist);
    }
  }

  // 특정 유저 좋아요 조회
  find(userId: number): Promise<ArtistLike[]> {
    return this.artistLikeRepository.find({ where: { userId } });
  }
}

// 새로운 접근법 제시(민호)
// async getLikeCountByArtistId(artistId: number) {
//   const artist: Artist = await this.artistRepository.findOne({
//     where: { artistId: artistId},
//   });

//   if (!artist) {
//     throw new BadRequestException('존재하지 않는 아티스트 입니다.');
//   }

//   const likes: ArtistLike[] = await this.artistLikeRepository.find({ where: { artist } });
//   return likes.length;
// }

// async isLike(user: User, artist: Artist) {
//   const findLike: ArtistLike = await this.artistLikeRepository.findOne({
//     where: { user, artist },
//   });
//   if (!findLike) {
//     return false;
//   }
//   return true;
// }

// /**
//  * 좋아요
//  */
// async like(user: User, artist: Artist) {
//   await this.artistLikeRepository.save({ user, artist });
// }

// /**
//  * 좋아요 취소
//  */
// async unlike(user: User, artist: Artist) {
//   const findLike: ArtistLike = await this.artistLikeRepository.findOne({
//     where: { user, artist },
//   });
//   await this.artistLikeRepository.remove(findLike);
// }
// }
