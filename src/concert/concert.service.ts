import { Injectable } from '@nestjs/common';
import { Concert } from '../entities/concert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ConcertService {
    constructor(
        @InjectRepository(Concert)
        private readonly concertRepository: Repository<Concert>
    ) {}


   async getConcert(categoryId) {
        return this.concertRepository.find({ where: {categoryId}});
    }



    findOne(concertId: number): Promise<Concert> {
        return this.concertRepository.findOne({where: {concertId}});
    }

    async create(createConcertDto: CreateConcertDto): Promise<void> {
        const {categoryId,concertName, concertImg, concertInfo, concertDate, ticketingDate, calender } = await this.concertRepository.save({...createConcertDto,
             createdAt:dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ'),
        updatedAt:dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ')});
        // await this.concertRepository.save({...createConcertDto});
    }

    async remove(concertId: number): Promise<void> {
        await this.concertRepository.delete(concertId);
    }
  }
//   'YYYY-MM-DDTHH:mm:ss'