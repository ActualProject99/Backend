import { PartialType } from '@nestjs/swagger';
import { CreateConcertLikeDto } from './create.concert_like.dto';

export class UpdateConcertLikeDto extends PartialType(CreateConcertLikeDto) {}
