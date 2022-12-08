import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { stringify } from 'querystring';
import { ArtistlikeService } from 'src/artist_like/artist_like.service';
import { ArtistLike } from 'src/entities/artist_like.entity';
import { User } from 'src/entities/user.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async getArtist() {
    const getArtist = await this.artistRepository.find();

    return getArtist;
  }
  // 특정 아티스트 조회
  findOne(artistId: number): Promise<Artist> {
    return this.artistRepository.findOne({ where: { artistId } });
  }

  async create(createArtistDto: CreateArtistDto): Promise<void> {
    const { category, artistName, artistImg, debutSong, debutDate } =
      await this.artistRepository.save({
        ...createArtistDto,
      });
  }
  // 삭제
  async remove(artistId: number): Promise<void> {
    await this.artistRepository.delete(artistId);
  }

  // 검색
  async searchArtist(args: any) {
    const { searchQuery } = args;

    return this.artistRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(artistName) AGAINST ('${searchQuery}' IN BOOLEAN MODE)`)
      .getMany();
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
  // // 좋아요, 좋아요 취소

  //     async like(currentUser: User, artistId: number) {
  //         const currentArtist = await this.findOne(artistId);
  //         const isLike = await this.artistlikeservice.isLike(currentUser, currentArtist)

  //    // 좋아요를 이미 했다면 좋아요 취소
  //         if (isLike) {
  //         await this.artistlikeservice.like(currentUser, currentArtist)
  //         return;
  //     }
  //     // 좋아요를 안했다면 좋아요 하기
  //     await this.artistlikeservice.like(currentUser, currentArtist)

  //     }
}
