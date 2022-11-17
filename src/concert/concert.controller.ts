import { Controller, Get, Post, Put, Delete, Param, Body}
 from '@nestjs/common';
import { ConcertService } from './concert.service';
import { Concert } from '../entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
// import { UpdateConcertDto } from './dto/update-concert.dto';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

@Controller('')
export class ConcertController {
  constructor(
    private concertService: ConcertService) {}

  // 카테고리별 조회
  @Get('category/:categoryId')
  findAll(@Param('categoryId') categoryId: number): Promise<Concert[]> {
    return this.concertService.getConcert(categoryId);
  }
  // 콘서트 상세 조회
  @Get('concert/:concertId')
  async findOne(@Param('concertId') concertId: number): Promise<Concert> {
    return this.concertService.findOne(concertId);
  }
  // 콘서트 생성
  @Post('concert')
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertService.create(createConcertDto);
  }
  // // 콘서트 수정
  // @Put('concert/:concertId')
  // update(
  //   @Param('concertId') concertId: number,
  //   @Body() updateConcertDto: UpdateConcertDto,
  // ) {
  //   return this.concertService.update(concertId, updateConcertDto);
  // }

  // 콘서트 삭제
  @Delete('concert/:concertId')
  remove(@Param('concertId') concertId: number) {
    return this.concertService.remove(concertId);
  }
}
