import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ArtistLike } from './artist_like.entity';
import { User } from './user.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column({nullable:true})
  concertId: number;

  @Column()
  artistName: string;

  @Column()
  artistImg: string;

  @Column()
  artistInfo: string;

  @Column({ default: 0})
  likeCount: number;

  @OneToMany(() => ArtistLike, artistLike => artistLike.user)
  artists: ArtistLike[]
  user : User
}
