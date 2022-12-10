import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('alarm')
export class AlarmController {
  constructor(private alarmService: AlarmService) {}

  // 알람 추가, 삭제
  @Put(':concertId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async alarm(@Param('concertId') concertId: number, @Req() req) {
    const existAlarm: object = await this.alarmService.existConcertAlarm(
      concertId,
      req.user.userId,
    );

    if (!existAlarm) {
      return this.alarmService.createAlarm(concertId, req.user.userId);
    } else {
      return this.alarmService.deleteAlarm(concertId, req.user.userId);
    }
  }

  // 상세페이지 알람 여부 조회
  @Get('/:concertId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async isAlarm(@Param('concertId') concertId: number, @Req() req) {
    return this.alarmService.getAlarm(concertId, req.user.userId);
  }

  // 마이페이지 알람 조회
  @Get('mypage')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Req() req) {
    return this.alarmService.findAlarms(req.user.userId);
  }
}
