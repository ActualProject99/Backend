import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ArtistlikeService } from './artist_like.service';
import { OnlyPrivateInterceptor } from 'src/common/interceptor/only-private.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { Artist } from '../entities/artist.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtPayload } from 'src/auth/jwt/jwt.payload';

@Controller('')
export class ArtistlikeController {
  constructor(private artistlikeService: ArtistlikeService) {}

  @Put('artistlike/:artistId')
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('artistId') artistId: number,
    payload: JwtPayload,
  ): Promise<any> {
    const like = await this.artistlikeService.like(artistId, payload.sub);
    return like;
  }
}

// 유저별 좋아요 조회 유저아이디 어떻게 받아오는지?? 마이페이지에서 좋아요한 가수를 볼테니 일단 파라미터로 userId를 받는다고 가정
// @Get(':userId')
// @UseGuards(JwtAuthGuard)
// @UseInterceptors(OnlyPrivateInterceptor)
//   findAllByUser(@Param('userId') userId: number) {
//     return this.artistlikeService.getArtistLikeByUser(userId);
//   }

//   // 좋아요 추가
//   @UseGuards(JwtAuthGuard)
//   @Post(':artistId')
//   addLike(@Param('artistId') artistId: number, user:User) {
//     return this.artistlikeService.addLike(user.userId, artistId);
//   }

//   // 좋아요 삭제
//   @Delete(':artistId')
//   remove(@Param('artistId') artistId: number, user:User) {
//     this.artistlikeService.deleteLike(user.userId, artistId);
//   }
// }
