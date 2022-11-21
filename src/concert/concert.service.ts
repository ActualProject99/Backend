import { Injectable } from '@nestjs/common';
import { Concert } from '../entities/concert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ConcertService {
    constructor(
        @InjectRepository(Concert)
        private readonly concertRepository: Repository<Concert>
    ) {}

// 카테고리별 조회
   async getConcert(categoryId: number) {
        return this.concertRepository.find({ where: {categoryId}});
    }

    // 상세 조회
    findOne(concertId: number): Promise<Concert> {
        return this.concertRepository.findOne({where: {concertId}});
    }

    // 생성
    async create(createConcertDto: CreateConcertDto): Promise<void> {
        const {categoryId,concertName, concertImg, concertInfo, concertDate, ticketingDate, calender } = await this.concertRepository.save({...createConcertDto,
             createdAt:dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ'),
        updatedAt:dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ')});
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
      .createQueryBuilder().select()
      .where(`MATCH(concertName) AGAINST ('${searchQuery}' IN BOOLEAN MODE)`)
      .getMany();
   }
}
