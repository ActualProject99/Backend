import { Controller, Get, Put, Param, UseGuards, Req } from '@nestjs/common';
import { ArtistlikeService } from './artist_like.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('artistlike')
export class ArtistlikeController {
  constructor(private artistlikeService: ArtistlikeService) {}

  // 마이페이지 좋아요 조회
  @Get('/mypage')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async isLike(@Req() req) {
    return await this.artistlikeService.find(req.user.userId);
  }

  // 아티스트 상세 좋아요 조회
  @Get(':artistId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  getLike(@Param('artistId') artistId: number, @Req() req) {
    return this.artistlikeService.getLike(artistId, req.user.userId);
  }

  // 아티스트 좋아요 추가, 삭제
  @Put(':artistId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async like(@Param('artistId') artistId: number, @Req() req) {
    const existLike: object = await this.artistlikeService.existLike(
      artistId,
      req.user.userId,
    );
    if (!existLike) {
      return this.artistlikeService.createArtistLike(artistId, req.user.userId);
    } else {
      return this.artistlikeService.deleteArtistLike(artistId, req.user.userId);
    }
  }
}
