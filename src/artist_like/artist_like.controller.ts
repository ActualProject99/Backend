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
  Res,
  Body,
} from '@nestjs/common';
import { ArtistlikeService } from './artist_like.service';
import { OnlyPrivateInterceptor } from 'src/common/interceptor/only-private.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Artist } from '../entities/artist.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { UserLoginDTO } from '../user/dto/user-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('artistlike')
export class ArtistlikeController {
  constructor(private artistlikeService: ArtistlikeService) {}

  // 마이페이지 좋아요 조회
  @Get('/mypage')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  public async isLike(@Req() req) {
    // return this.artistlikeService.find(req.user.userId);
    return this.artistlikeService.find(req.user.userId);
  }
  // 아티스트 상세 좋아요 조회
  @Get(':artistId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  getLike(@Param('artistId') artistId: number, @Req() req) {
    return this.artistlikeService.getLike(artistId, req.user.userId);
  }

  // 아티스트 좋아요 등록/취소
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
}
