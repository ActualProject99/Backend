import { Injectable } from '@nestjs/common';
import { Concert } from '../entities/concert.entity';
import { hotConcert } from '../entities/hotconcert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
    private readonly hotconcertRepository: Repository<hotConcert>,
  ) {}

  // 핫콘서트 조회
  async hotConcert() {
    return this.hotconcertRepository.find();
  }

  // 카테고리별 조회
  async getConcert(categoryId: number) {
    return this.concertRepository.find({ where: { categoryId } });
  }

  // 아티스트별 콘서트 조회
  findByArtist(artistId: number) {
    return this.concertRepository.find({ where: { artistId } });
  }

  // 콘서트 월별 전체 조회
  async findAllConcertByMonth(month: number) {
    const findAllConcertByMonth = await this.concertRepository.find({
      where: { month },
    });

    return findAllConcertByMonth;
  }

  // 전체 조회
  find() {
    return this.concertRepository.find();
  }

  // 생성
  async create(createConcertDto: CreateConcertDto): Promise<void> {
    const {
      concertName,
      concertImg,
      concertInfo,
      concertDate,
      ticketingDate,
      calender,
      month,
    } = await this.concertRepository.save({ ...createConcertDto });
    // await this.concertRepository.save({...createConcertDto});
  }

  // 삭제
  async remove(concertId: number): Promise<void> {
    await this.concertRepository.delete(concertId);
  }

  // 검색
  searchConcert = (args: any) => {
    const { searchQuery } = args;

    return this.concertRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(concertName) AGAINST ('${searchQuery}' IN BOOLEAN MODE)`)
      .getMany();
  };

  // 수정
  async update(concertId: number, concert: Concert): Promise<void> {
    const existedConcert = await this.concertRepository.findOne({
      where: { concertId },
    });
    if (existedConcert) {
      await this.concertRepository
        .createQueryBuilder()
        .update(Concert)
        .set({
          concertName: concert.concertName,
          concertImg: concert.concertImg,
          concertInfo: concert.concertInfo,
          concertDate: concert.concertDate,
          ticketingDate: concert.ticketingDate,
          calender: concert.calender,
        })
        .where('concertId = :concertId', { concertId })
        .execute();
    }
  }
}
