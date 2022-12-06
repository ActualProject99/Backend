import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req, @Res() res: Response) {
    res.redirect('https://www.tgle.ml');
  }
}
