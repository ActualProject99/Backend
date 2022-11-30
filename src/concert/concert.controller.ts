import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { Concert } from '../entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { Panorama } from 'aws-sdk';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

@Controller('')
export class ConcertController {
  constructor(private concertService: ConcertService) {}

  // 콘서트 전체 조회
  @Get('concert')
  findAll() {
    return this.concertService.findAll();
  }

  // 카테고리별 조회
  @Get('category/:categoryId')
  findAllByCat(@Param('categoryId') categoryId: number): Promise<Concert[]> {
    return this.concertService.getConcert(categoryId);
  }

  // 콘서트 월별로 전체조회
  @Get('month')
  findAllConcertByMonth(@Query('month') month: number): Promise<Concert[]> {
    return this.concertService.findAllConcertByMonth(month);
  }

  // 아티스트별 콘서트 조회
  @Get('concert/artist/:artistId')
  async findByArtist(@Param('artistId') artistId: number): Promise<Concert[]> {
    return this.concertService.findByArtist(artistId);
  }

  // 콘서트 상세 조회 --> 그냥 콘서트 조회로 바꾸면 프론트에서 직접 뽑아서 씀
  @Get('concert/:concertId')
  async findOne(@Param('concertId') concertId: number): Promise<Concert> {
    return this.concertService.findOne(concertId);
  }

  // 콘서트 생성
  @Post('concert')
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertService.create(createConcertDto);
  }

  // 콘서트 수정
  @Put('concert/:concertId')
  update(@Param('concertId') concertId: number, @Body() concert: Concert) {
    return this.concertService.update(concertId, concert);
  }

  // 콘서트 삭제
  @Delete('concert/:concertId')
  remove(@Param('concertId') concertId: number) {
    return this.concertService.remove(concertId);
  }
}
