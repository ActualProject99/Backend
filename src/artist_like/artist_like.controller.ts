import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ArtistlikeService } from './artist_like.service';
import { Artist } from '../entities/artist.entity';
import { User } from '../entities/user.entity';


@Controller('artistlike')
export class ArtistlikeController {
  constructor(private artistlikeService: ArtistlikeService) {}

  // 특정 아티스트 likeCount 조회
  @Get(':artistId')
  findOneByArtist(@Param('artistId') artistId: number): Promise<Artist> {
    return this.artistlikeService.getLikeCountByArtistId(artistId);
  }
  // 유저별 좋아요 조회 유저아이디 어떻게 받아오는지?? 마이페이지에서 좋아요한 가수를 볼테니 일단 파라미터로 userId를 받는다고 가정 
  @Get(':userId')
  findAllByUser(@Param('userId') userId: number) {
    return this.artistlikeService.getArtistLikeByUser(userId);
  }

  // 좋아요 추가, likeCount 증가
  @Post(':artistId')
  addLike(@Param('artistId') artistId: number, user:User) {
    return this.artistlikeService.addLike(user.userId, artistId);
  }
  increment(artist:Artist) {
    return this.artistlikeService.increment(artist);
  }

  // 좋아요 삭제, likeCount 감소
  @Delete(':artistId')
  remove(@Param('artistId') artistId: number, user:User) {
    this.artistlikeService.deleteLike(user.userId, artistId);
  }
  decrement(artist:Artist) {
    return this.artistlikeService.decrement(artist);
  }
}
