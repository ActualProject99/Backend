import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto {
  @IsOptional()
  @ApiProperty({ type: String, description: '댓글', example: '댓글' })
  comment: string;
}
