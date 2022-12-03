import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  // // 콘서트별 댓글 조회(페이지)
  // @Get(':concertId')
  // async findAll(
  //   @Param('concertId') concertId: number,
  //   // @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  //   // @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  // ): Promise<Pagination<Comment>> {
  //   limit = limit > 10 ? 10 : limit; // 필요없는 코드같은데
  //   return this.commentService.paginate({
  //     page,
  //     limit,
  //   });
  // }

  // 콘서트별 댓글 조회(페이지)
  @Get(':concertId')
  async findAll(@Param('concertId') concertId: string): Promise<Comment[]> {
    return this.commentService.findAll(concertId);
  }

  // 유저별 댓글 조회
  @Get('user/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Param('userId') userId: number) {
    return this.commentService.findByUser(userId);
  }

  // 댓글 생성
  @Post(':concertId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('concertId') concertId: number,
    @Req() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(
      concertId,
      req.user.userId,
      createCommentDto,
    );
  }

  // // 댓글 수정
  // @Put(':commentId')
  // update(
  //   @Param('commentId') commentId: number,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // ) {
  //   return this.commentService.update(commentId, updateCommentDto);
  // }

  // 댓글 삭제
  @Delete('detail/:commentId')
  remove(@Param('commentId') commentId: number) {
    return this.commentService.remove(commentId);
  }
}
