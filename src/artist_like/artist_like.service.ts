import { Injectable, Response } from '@nestjs/common';
import { ArtistLike } from '../entities/artist_like.entity';
import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

@Injectable()
export class ArtistlikeService {
    constructor(
        @InjectRepository(ArtistLike)
        private readonly artistLikeRepository: Repository<ArtistLike>,
        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>
    ) {}

// 특정 아티스트 likeCount 조회
    async getLikeCountByArtistId(artistId: number): Promise<Artist> {
        return this.artistRepository.findOne({select: {likeCount: true}, where: {artistId}});
    }
    
// 좋아요 여부
    async findLike(userId: number, artistId: number) {
        const isLike =  await this.artistLikeRepository.findOne({where:{userId, artistId} })
        if(isLike) {
            return { isLike: true }
        } else {
            return { isLike: false }
        }
    }

// 유저별 좋아요 조회 유저아이디 어떻게 받아오는지?? 파라미터는 아닌데
    async getArtistLikeByUser(userId: number) {
        return this.artistLikeRepository.find({where:{userId}})
    };

// 좋아요 추가
async addLike(userId: number, artistId: number) {
    this.artistLikeRepository.create({userId, artistId})
}
// 좋아요 삭제
async deleteLike(userId: number, artistId: number) {
   await this.artistLikeRepository.delete({ userId:userId, artistId:artistId })
}
// likeCount 증가
async increment(artistId: number) {
    await getConnection().createQueryBuilder().update(artistId).set({ likeCount: () => "likeCount + 1"}).execute();
}
// likeCount 감소
async decrement(artistId: number) {
    await getConnection().createQueryBuilder().update(artistId).set({ likeCount: () => "likeCount - 1"}).execute();
}
}
