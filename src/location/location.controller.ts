import { Controller, Param, Get } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from '../entities/location.entity';

@Controller('location')
export class LocationController {
    constructor(
        private locationService: LocationService
    ) {}

    // 공연장 조회
    @Get(':locationId')
    findOne(@Param('locationId') locationId: number) {
        return this.locationService.findOne(locationId);
    }
}
