import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';

@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  // 카테고리별 조회
  @Get('/:categoryId')
  findAll(@Param('categoryId') categoryId: number) {
    return `This action returns #${categoryId}`;
  }
  // 콘서트 상세 조회
  @Get('/:concertId')
  findOne(@Param('concertId') concertId: number) {
    return `This action returns a #${concertId}`;
  }
  // 콘서트 생성
  @Post()
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertService.create(createConcertDto);
  }
  // 콘서트 수정
  @Put(':concertId')
  update(
    @Param('concertId') concertId: number,
    @Body() updateConcertDto: UpdateConcertDto,
  ) {
    return this.concertService.update(+concertId, updateConcertDto);
  }

  // 콘서트 삭제
  @Delete(':concertId')
  remove(@Param('concertId') concertId: number) {
    return this.concertService.remove(+concertId);
  }
}
