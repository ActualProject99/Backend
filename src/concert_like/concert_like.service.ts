import { Injectable, Response } from '@nestjs/common';
import { ConcertLike } from 'src/entities/concert_like.entity'; 
import { Concert } from 'src/entities/concert.entity';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { throwError } from 'rxjs';
import * as dayjs from 'dayjs';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateConcertLikeDto } from './dto/create.concert_like.dto';

@Injectable()
export class ConcertlikeService {
  constructor(
    @InjectRepository(ConcertLike)
    private readonly concertlikeRepository: Repository<ConcertLike>,
    // @InjectRepository(Concert)
    // private readonly concertRepository: Repository<Concert>,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
  ) {}

  async existLike(concertId:number, userId:number) {
    return this.concertlikeRepository.findOne({where:{concertId, userId}})
  }
  
  async createConcertLike(concertId: number, userId: number) {
  
    const concertlike = new ConcertLike();
    concertlike.concertId = concertId;
    concertlike.userId = userId;
    
    return this.concertlikeRepository.save(concertlike)}
  
  
    async deleteConcertLike(concertId: number, userId: number): Promise<any> {
      const existLike = await this.concertlikeRepository.findOne({where:{concertId, userId}})
      if(existLike){
    return this.concertlikeRepository.remove(existLike)}
   }


   // 특정 유저 좋아요 조회
 find(userId: number): Promise<ConcertLike[]> {
  return this.concertlikeRepository.find({ where: { userId } });
}
}