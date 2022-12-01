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
import { ConcertlikeService } from './concert_like.service';
import { OnlyPrivateInterceptor } from 'src/common/interceptor/only-private.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Concert } from '../entities/concert.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { UserLoginDTO } from '../user/dto/user-login.dto';
import { CreateConcertLikeDto } from './dto/create.concert_like.dto';

@Controller('concertlike')
export class ConcertlikeController {
  constructor(private concertlikeService: ConcertlikeService) {}

  //   // 좋아요 추가
  // @Post(':concertId')
  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  // setConcertlike(@Param('concertId', ParseIntPipe) concertId: number, @Req() req){
  //   return this.concertlikeService.createConcertLike(concertId, req.user.userId)
  // }

  // // 좋아요 삭제
  // @Delete(':concertId')
  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  // delete(@Param('concertId', ParseIntPipe) concertId: number, @Req() req){
  //   return this.concertlikeService.deleteConcertLike(concertId, req.user.userId)
  // }

  @Put(':concertId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async like(@Param('concertId', ParseIntPipe) concertId: number, @Req() req) {
    const existLike: any = await this.concertlikeService.existLike(
      concertId,
      req.user.userId,
    );

    if (!existLike) {
      return this.concertlikeService.createConcertLike(
        concertId,
        req.user.userId,
      );
    } else {
      return this.concertlikeService.deleteConcertLike(
        concertId,
        req.user.userId,
      );
    }
  }

  @Get('mypage/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Param('userId') userId: number) {
    return this.concertlikeService.find(userId);
  }

  // // 유저별 좋아요 조회 유저아이디 어떻게 받아오는지?? 마이페이지에서 좋아요한 가수를 볼테니 일단 파라미터로 userId를 받는다고 가정
  // @Get('/mypage/:userId')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(OnlyPrivateInterceptor)
  // findAllByUser(@Param('userId') userId: number) {
  //     return this.concertlikeService.findAllByUser(userId);
}

// @Get('count/:artistId') // 좋아요 카운트
// getLikeCount(@Param('postId', ParseIntPipe) postId: number) {
//   return this.heartsService.getHeartCount(postId);

// @Put('artistlike/:artistId')
// @UseGuards(JwtAuthGuard)
// async like(
//   @Param('artistId') ParseIntPipe, artistId: number,  @Req() req
// ){
// return this.artistlikeService.like(artistId, req.payload.userId);

// }

// 유저별 좋아요 조회 유저아이디 어떻게 받아오는지?? 마이페이지에서 좋아요한 가수를 볼테니 일단 파라미터로 userId를 받는다고 가정
//   @Get(':userId')
//   @UseGuards(JwtAuthGuard)
//   @UseInterceptors(OnlyPrivateInterceptor)
//     findAllByUser(@Param('userId') userId: number) {
//       return this.artistlikeService.getArtistLikeByUser(userId);
//     }

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
