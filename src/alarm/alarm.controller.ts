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

  @Get('mypage/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Param('userId') userId: number) {
    return this.alarmService.findAlarms(userId);
  }
}
