import { Controller, Get, Post, Put, Delete, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArtistlikeService } from './artist_like.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/user/jwt/jwt.guard';
import { OnlyPrivateInterceptor } from 'src/common/interceptor/only-private.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Controller('artistlike')
export class ArtistlikeController {
  constructor(private artistlikeService: ArtistlikeService) {}

  
// 유저별 좋아요 조회 유저아이디 어떻게 받아오는지?? 마이페이지에서 좋아요한 가수를 볼테니 일단 파라미터로 userId를 받는다고 가정 
@Get(':userId')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
  findAllByUser(@Param('userId') userId: number) {
    return this.artistlikeService.getArtistLikeByUser(userId);
  }

  // 좋아요 추가
  @UseGuards(JwtAuthGuard)
  @Post(':artistId')
  addLike(@Param('artistId') artistId: number, user:User) {
    return this.artistlikeService.addLike(user.userId, artistId);
  }

  // 좋아요 삭제
  @Delete(':artistId')
  remove(@Param('artistId') artistId: number, user:User) {
    this.artistlikeService.deleteLike(user.userId, artistId);
  }
}
