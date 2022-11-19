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
    Query
  } from '@nestjs/common';
  import { CommentService } from './comment.service';
  import { Comment } from '../entities/comment.entity';
  import { CreateCommentDto } from './dto/create-comment.dto';
  // import { UpdateCommentDto } from './dto/update-comment.dto';
  // import { Repository } from 'typeorm';
  // import { InjectRepository } from '@nestjs/typeorm';
  import { Pagination } from 'nestjs-typeorm-paginate';
  
  @Controller('comment')
  export class CommentController {
    constructor(private commentService: CommentService) {}
  
// pagination 설정


    // 콘서트별 댓글 조회
    @Get(':concertId')
    async findAll(@Param('concertId') concertId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Comment>> {
      limit = limit > 10 ? 10 : limit; // 필요없는 코드같은데
      return this.commentService.paginate({
        page, limit,
      });
    }

    // 댓글 상세 조회
    // @Post
    // 댓글 생성
  @Post(':concertId')
  create(
    @Param('concertId') concertId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create({ concertId }, createCommentDto);
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
  