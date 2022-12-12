import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ConcertLikeService } from './concert_like.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('concertlike')
export class ConcertLikeController {
  constructor(private concertLikeService: ConcertLikeService) {}

  // 상세페이지 좋아요 여부
  @Get(':concertId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getLike(@Param('concertId') concertId: number, @Req() req) {
    return this.concertLikeService.getLike(concertId, req.user.userId);
  }

  // 마이페이지 좋아요한 콘서트 조회
  @Get('mypage/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Param('userId') userId: number) {
    return this.concertLikeService.find(userId);
  }

  // 좋아요 추가, 삭제
  @Put(':concertId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async like(@Param('concertId') concertId: number, @Req() req) {
    const existLike: object = await this.concertLikeService.existConcertLike(
      concertId,
      req.user.userId,
    );

    if (!existLike) {
      return this.concertLikeService.createConcertLike(
        concertId,
        req.user.userId,
      );
    } else {
      return this.concertLikeService.deleteConcertLike(
        concertId,
        req.user.userId,
      );
    }
  }
}
