import { PartialType } from '@nestjs/swagger';
import { CreateArtistlikeDto } from './create-artist_like.dto';

export class UpdateArtistlikeDto extends PartialType(CreateArtistlikeDto) {}
