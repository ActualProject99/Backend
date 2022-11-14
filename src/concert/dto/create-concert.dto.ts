import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConcertDto {
  @ApiProperty({
    description: 'concertName field',
  })
  @IsNotEmpty()
  @IsString()
  public concertName: string;

  @ApiProperty({
    description: 'concertImg field',
  })
  @IsNotEmpty()
  @IsString()
  public concertImg: string;

  @ApiProperty({
    description: 'artist field',
  })
  @IsNotEmpty()
  @IsString()
  public artist: string;

  @ApiProperty({
    description: 'concertInfo field',
  })
  @IsNotEmpty()
  @IsString()
  public concertInfo: string;

  @ApiProperty({
    description: 'concertDate field',
  })
  @IsNotEmpty()
  @IsString()
  public concertDate: string;

  @ApiProperty({
    description: 'ticketingDate field',
  })
  @IsNotEmpty()
  @IsString()
  public ticketingDate: string;
}
