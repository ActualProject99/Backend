import { Injectable, Response } from '@nestjs/common';
import { ArtistLike } from '../entities/artist_like.entity';
import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { throwError } from 'rxjs';
import * as dayjs from 'dayjs';

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

  async like(artistId: number, like: any): Promise<void> {
    // try {
    const userId = like.payload.sub;
    console.log(`1`, artistId, userId);
    const existLike = await this.artistLikeRepository.findOne({
      where: { artistId, userId },
    });
    console.log(existLike);
    if (!existLike) {
      console.log(`2`, artistId, userId);
      const data = this.artistLikeRepository.create({
        userId,
        artistId,
        createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ'),
        isLike: true,
      });
      await this.artistLikeRepository.save(data);
    } else {
      // console.log(`3`,artistId, userId)
      //   if (existLike.isLike)
      //   await this.artistLikeRepository.update(
      //       { artistLikeId: existLike.artistLikeId },
      //       { isLike: false },
      //     );
      //   else
      //     await this.artistLikeRepository.update(
      //       { artistLikeId: existLike.artistLikeId },
      //       { isLike: true },
      //     );
      await this.artistLikeRepository.update(existLike, {});
    }

    //     // } catch (error) {
    //         throwError(
    //           {
    //             success: false,
    //             statusCode: 400,
    //             error: '알 수 없는 오류가 발생했습니다.',
    //             timestamp: new Date().toISOString(),
    //           },)
    // }
  }

  // // 특정 아티스트 likeCount 조회
  //     async getLikeCountByArtistId(artistId: number): Promise<Artist> {
  //         return this.artistRepository.findOne({select: {likeCount: true}, where: {artistId}});
  // }

  // // 좋아요 여부
  //     async findLike(userId: number, artistId: number) {
  //   const user = {userId:userId, artistId: artistId}
  //         const isLike =  await this.artistLikeRepository.findOne({where:{user}})
  //         if(isLike) {
  //             return { isLike: true }
  //         } else {
  //             return { isLike: false }
  //         }
  //     }

  // // 유저별 좋아요 조회
  //     async getArtistLikeByUser(userId: number) {
  //         const user = {userId}
  //         return this.artistLikeRepository.find({where:{user}})
  //     };

  // // 좋아요 추가
  // async addLike(userId: number, artistId: number) {
  //     const user = {userId, artistId}
  //     this.artistLikeRepository.create({user})
  // }
  // // 좋아요 삭제
  // async deleteLike(userId: number, artistId: number) {
  //     const user = {userId, artistId}
  //    await this.artistLikeRepository.delete({user})
  // }

  // async findUserLike(userId): Promise<User[]> {
  //     const result = this.userRepository
  //     .createQueryBuilder('u')
  //       .leftJoinAndSelect('u.artistlikes', 'artistlike')
  //       .leftJoinAndSelect('u.artists', 'artist')
  //       .select([
  //         'artist_user_no',
  //         'artistlike_artist_no'

  //       ])
  //       .where(`artist_user_no = $(userId)`)
  //       .getMany();
  //       return result
  // }
}
