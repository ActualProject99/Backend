import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ArtistLike } from 'src/entities/artist_like.entity';

export class CreateArtistlikeDto extends PickType(ArtistLike, [
  'userId',
  'artistId'
 ] as const) {}
