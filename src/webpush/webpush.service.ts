import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { WebPush } from '../entities/webpush.entity';

@Injectable()
export class WebpushService {
  constructor() // private readonly webpushRepository: Repository<WebPush>, // @InjectRepository(WebPush)
  {}

  async webPush(projectId, targetType, targetIds, title, body, url) {}
}
