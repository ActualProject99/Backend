import { Body, Controller, Get, Post, Put, Delete, Param} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from '../entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
// import { UpdateArtistDto } from './dto/update-artist.dto';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

@Controller('artist')
export class ArtistController {
  constructor(
    private artistService: ArtistService) {}

  // 모든 아티스트 조회
  @Get()
  findAll(): Promise<Artist[]> {
    return this.artistService.getArtist();
  }
  // 특정 아티스트 조회
  @Get(':artistId')
  async findOne(@Param('artistId') artistId: number): Promise<Artist> {
    return this.artistService.findOne(artistId);
  }
  // 아티스트 생성
  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  // 아티스트 정보 수정
  @Put(':artistId')
  update(@Param('artistId') artistId: number, @Body() artist: Artist) {
    return this.artistService.update(artistId, artist);
  }
  
  // 아티스트 삭제
  @Delete(':artistId')
  remove(@Param('artistId') artistId: number) {
    this.artistService.remove(artistId);
  }
}
