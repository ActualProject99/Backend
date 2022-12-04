import { Controller, Param, Get } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  // 공연장 조회
  @Get('')
  find() {
    return this.locationService.find();
  }
}
