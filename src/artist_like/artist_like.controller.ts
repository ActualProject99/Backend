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
  ParseIntPipe,
} from '@nestjs/common';
import { ArtistlikeService } from './artist_like.service';
import { OnlyPrivateInterceptor } from 'src/common/interceptor/only-private.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Artist } from '../entities/artist.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { UserLoginDTO } from '../user/dto/user-login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('artistlike')
export class ArtistlikeController {
  constructor(private artistlikeService: ArtistlikeService) {}

  // 아티스트 상세 좋아요 조회
  @Get(':artistId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  getLike(@Param('artistId') artistId: number, @Req() req) {
    return this.artistlikeService.getLike(artistId, req.user.userId);
  }

  @Put(':artistId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async like(@Param('artistId') artistId: number, @Req() req) {
    const existLike: any = await this.artistlikeService.existLike(
      artistId,
      req.user.userId,
    );
    if (!existLike) {
      return this.artistlikeService.createArtistLike(artistId, req.user.userId);
    } else {
      return this.artistlikeService.deleteArtistLike(artistId, req.user.userId);
    }
  }

  @Get('mypage/:userId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async isLike(@Param('userId') userId: number): Promise<any> {
    return this.artistlikeService.find(userId);
  }
}



  
  // @Put(':artistId')
  // @ApiBearerAuth('jwt')
  // // @ApiBearerAuth('refresh-token')
  // @UseGuards(JwtAuthGuard)
  // // @UseInterceptors(OnlyPrivateInterceptor)
  // async likeArtist(
  //   @Param('artistId', ParseIntPipe) artistId: number,
  //   @Req() req,
  //   likeArtist: number,
  // ) {
  //   const existLike: any = await this.artistlikeService.existLike(
  //     artistId,
  //     req.user.userId,
  //   );
  //   // artistId = likeArtist;
  //   if (!existLike) {
  //     return (
  //       this.artistlikeService.createArtistLike(artistId, req.user.userId),
  //       this.artistlikeService.createLikeArtist(artistId)
  //     )
  //   } else {
  //     return this.artistlikeService.deleteArtistLike(artistId, req.user.userId),
  //       // this.artistlikeService.deleteLikeArtist(artistId)
  //   }
  // }







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
  //


