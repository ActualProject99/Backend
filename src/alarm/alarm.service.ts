import { Injectable } from '@nestjs/common';
import { ConcertLike } from 'src/entities/concert_like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from '../entities/alarm.entity';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
  ) {}

  async existConcertAlarm(concertId: number, userId: number) {
    const existAlarm = await this.alarmRepository.findOne({
      where: { concertId, userId },
    });
    return existAlarm;
  }

  async createAlarm(concertId: number, userId: number) {
    const alarm = new Alarm();
    alarm.concertId = concertId;
    alarm.userId = userId;

    return this.alarmRepository.save(alarm);
  }

  async deleteAlarm(concertId: number, userId: number): Promise<object> {
    const existAlarm = await this.alarmRepository.findOne({
      where: { concertId, userId },
    });
    if (existAlarm) {
      return this.alarmRepository.remove(existAlarm);
    }
  }

  // 특정 유저 좋아요 조회
  findAlarms(userId: number): Promise<Alarm[]> {
    return this.alarmRepository.find({ where: { userId } });
  }

  // 콘서트 상세 좋아요 조회
  async getAlarm(concertId: number, userId: number) {
    const getAlarm = await this.alarmRepository.findOne({
      where: { userId, concertId },
    });

    if (getAlarm) {
      return { concertId: concertId, isLike: true };
    } else {
      return { concertId: concertId, isLike: false };
    }
  }
}
