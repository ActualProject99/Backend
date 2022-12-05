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
import { ConcertLikeService } from './concert_like.service';
import { OnlyPrivateInterceptor } from 'src/common/interceptor/only-private.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Concert } from '../entities/concert.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { UserLoginDTO } from '../user/dto/user-login.dto';
import { CreateConcertLikeDto } from './dto/create.concert_like.dto';

@Controller('concertlike')
export class ConcertLikeController {
  constructor(private concertLikeService: ConcertLikeService) {}

  // 아티스트 상세 좋아요 조회
  @Get(':concertId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  getLike(@Param('concertId') concertId: number, @Req() req) {
    return this.concertLikeService.getLike(concertId, req.user.userId);
  }

  @Put(':concertId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async like(@Param('concertId', ParseIntPipe) concertId: number, @Req() req) {
    const existLike: any = await this.concertLikeService.existConcertLike(
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

  @Get('mypage/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Param('userId') userId: number) {
    return this.concertLikeService.find(userId);
  }
}
