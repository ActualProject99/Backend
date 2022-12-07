import { Controller, Get, Req, Res, Post, Param, Body } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
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
