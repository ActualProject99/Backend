import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('a201b475-fab4-47e3-94e7-dcb905e8afa4/notifications')
  @ApiBearerAuth('7H9BtZ_LqV-G5v6Chi2t-')
  async webPush(
    @Param('projectId') projectId,
    @Body() targetType,
    targetIds,
    templateId,
    title,
    body,
    url,
    imageUrl,
  ) {}
}
