import { Injectable } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';

@Injectable()
export class ConcertService {
  create(createConcertDto: CreateConcertDto) {
    return 'This action adds a new test';
  }

  findAll() {
    return `This action returns all test`;
  }

  findOne(concertId: number) {
    return `This action returns a #${concertId} test`;
  }

  update(concertId: number, updateConcertDto: UpdateConcertDto) {
    return `This action updates a #${concertId} test`;
  }

  remove(concertId: number) {
    return `This action removes a #${concertId} test`;
  }
}
