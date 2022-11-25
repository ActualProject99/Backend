import { ApiProperty, PickType } from '@nestjs/swagger';
import { ConcertLike } from '../../entities/concert_like.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConcertLikeDto extends PickType(ConcertLike, [
    'userId',
    'concertId',
 ] as const) {}
