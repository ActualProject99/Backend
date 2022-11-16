import { Module } from '@nestjs/common';
import { MySqlConfigService } from './config.service';

@Module({
  providers: [MySqlConfigService],
})
export class MySqlConfigModule {}
