import { Location } from '../entities/location.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './artist.controller';
import { LocationService } from './artist.service';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [TypeOrmModule],
  })
export class LocationModule {}
