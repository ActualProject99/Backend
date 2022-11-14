import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConcertDto {
  @ApiProperty({
    description: 'name1 field',
  })
  @IsNotEmpty()
  @IsString()
  public name1: string;

  @ApiProperty({
    description: 'name2 field',
  })
  @IsNotEmpty()
  @IsString()
  public name2: string;

  @ApiProperty({
    description: 'name3 field',
  })
  @IsString()
  public name3: string;
}
