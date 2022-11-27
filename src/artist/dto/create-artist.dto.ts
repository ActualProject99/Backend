import { ApiProperty, PickType } from '@nestjs/swagger';
import { Artist } from '../../entities/artist.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// export class CreateArtistDto {
//   @ApiProperty({
//     description: 'artistName field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public artistName: string;

//   @ApiProperty({
//     description: 'artistImg field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public artistImg: string;

//   @ApiProperty({
//     description: 'artistInfo field',
//   })
//   @IsNotEmpty()
//   @IsString()
//   public artistInfo: string;
// }

export class CreateArtistDto extends PickType(Artist, [
  'category',
  'artistName',
  'artistImg',
  'debutSong',
  'debutDate',
 ] as const) {
// @IsString(),
// @IsNotEmpty()
 }
 