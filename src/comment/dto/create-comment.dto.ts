import { ApiProperty, PickType } from '@nestjs/swagger';
import { Comment } from '../../entities/comment.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto extends PickType(Comment, ['comment'] as const) {}
