import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  // 아티스트 전체 조회
  async getArtist() {
    await this.artistRepository.find();
  }

  // 특정 아티스트 조회
  async findOne(artistId: number): Promise<Artist> {
    return await this.artistRepository.findOne({ where: { artistId } });
  }

  // 생성
  async create(createArtistDto: CreateArtistDto): Promise<void> {
    await this.artistRepository.save({
      ...createArtistDto,
    });
  }

  // 수정
  async update(artistId: number, artist: Artist): Promise<void> {
    const existedArtist = await this.findOne(artistId);
    if (existedArtist) {
      await this.artistRepository
        .createQueryBuilder()
        .update(Artist)
        .set({
          artistName: artist.artistName,
          artistImg: artist.artistImg,
        })
        .where('artistId = :artistId', { artistId })
        .execute();
    }
  }

  // 삭제
  async remove(artistId: number): Promise<void> {
    await this.artistRepository.delete(artistId);
  }
}
