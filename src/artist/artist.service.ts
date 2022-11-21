import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { stringify } from 'querystring';





@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>
    ) {}

   async getArtist() {
        const getArtist =  await this.artistRepository.find();
        
        return getArtist;
    }



    findOne(artistId: number): Promise<Artist> {
        return this.artistRepository.findOne({where:{artistId}});
    }

    async create(createArtistDto: CreateArtistDto,): Promise<void> {
        const { artistName,artistImg,artistInfo } = await this.artistRepository.save({...createArtistDto})
    }
   
    async remove(artistId: number): Promise<void> {
        await this.artistRepository.delete(artistId);
    }


    // 검색 
  searchArtist = (args: any) => {
        const { searchQuery } = args;
         
    return this.artistRepository
      .createQueryBuilder().select()
      .where(`MATCH(artistName) AGAINST ('${searchQuery}' IN BOOLEAN MODE)`)
      .getMany();
   }

// 수정
    async update(artistId: number, artist: Artist): Promise<void> {
        const existedArtist = await this.findOne(artistId);
        if(existedArtist)   {
         await  this.artistRepository
                .createQueryBuilder()
                .update(Artist)
                .set({
                    artistName : artist.artistName,
                    artistImg: artist.artistImg,
                    artistInfo : artist.artistInfo,
                })
                .where("artistId = :artistId", {artistId})
                .execute();
        }
    }
}
