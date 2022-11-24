// import { Controller, Get, Post, Put, Delete, Param, Res } from '@nestjs/common';
// import { ArtistlikeService } from './artist_like.service';
// import { ArtistLike } from '../entities/artist_like.entity';

// @Controller('artistlike')
// export class ArtistlikeController {
//   constructor(private artistlikeService: ArtistlikeService) {}

//   // 아티스트별 좋아요 조회
//   @Get(':artistId')
//   findAllByArtist(@Param('artistId') artistId: number): Promise<ArtistLike[]> {
//     return this.artistlikeService.getArtistLikeByArtist(artistId);
//   }
//   // 유저별 좋아요 조회 유저아이디 어떻게 받아오는지?? 파라미터는 아닌데
//   @Get(':userId')
//   findAllByUser(@Param('userId') userId: number): Promise<ArtistLike[]> {
//     return this.artistlikeService.getArtistLikeByUser(userId);
//   }
//   // 좋아요 등록
//   @Put(':artistId')
//   update() {
//     const { userId } = Res.locals.user;
//     return this.artistlikeService.create();
//   }
// }
