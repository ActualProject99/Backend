import { Injectable } from '@nestjs/common';
import { Concert } from '../entities/concert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
  ) {}
  // 카테고리별 조회
  async getConcert(categoryId) {
    return this.concertRepository.find({ where: { categoryId } });
  }
  // 콘서트 상세 조회 왜 에러?
  // findOne(concertId: number): Promise<Concert> {
  //     return this.concertRepository.findOne(concertId);
  // }
  // 콘서트 게시글 생성(관리자)
  async create(createConcertDto: CreateConcertDto): Promise<void> {
    const { concertName, concertImg, concertInfo, concertDate, ticketingDate } =
      createConcertDto;
    await this.concertRepository.save({ ...createConcertDto });
  }
  // 콘서트 삭제(관리자)
  async remove(concertId: number): Promise<void> {
    await this.concertRepository.delete(concertId);
  }
}
