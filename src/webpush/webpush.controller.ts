import {
  Controller,
  Body,
  Post,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WebpushService } from './webpush.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('')
export class WebpushController {
  constructor(private webpushService: WebpushService) {}

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
