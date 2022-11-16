import { ApiProperty,PickType } from '@nestjs/swagger';
import { Concert } from '../../entities/concert.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// export class CreateConcertDto {
//   @ApiProperty({
//     description: 'concertName field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public concertName: string;

//   @ApiProperty({
//     description: 'concertImg field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public concertImg: string;

//   @ApiProperty({
//     description: 'concertInfo field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public concertInfo: string;

//   @ApiProperty({
//     description: 'concertDate field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public concertDate: string;

//   @ApiProperty({
//     description: 'ticketingDate field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public ticketingDate: string;
// }
export class CreateConcertDto extends PickType(Concert, [
  'concertName',
  'concertImg',
  'concertInfo',
  'concertDate',
  'ticketingDate',
 ] as const) {}
