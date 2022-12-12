import { PickType } from '@nestjs/swagger';
import { Concert } from '../../entities/concert.entity';

export class CreateConcertDto extends PickType(Concert, [
  'categoryId',
  'month',
  'concertName',
  'concertImg',
  'concertInfo',
  'concertDate',
  'ticketingDate',
  'ticketingUrl',
  'calender',
  'playTime',
  'locationName',
  'ratings',
  'locationId',
] as const) {}
