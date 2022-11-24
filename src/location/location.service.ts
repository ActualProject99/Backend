import { Injectable } from '@nestjs/common';
import { Location } from 'src/entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class LocationService {
constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>
) {}

// 공연장 정보 조회
async findOne(locationId: number){
    return this.locationRepository.findOne({ where: { locationId }});
}

}
