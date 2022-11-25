import { Location } from '../entities/location.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [TypeOrmModule],
  })
export class LocationModule {}
