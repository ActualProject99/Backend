import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { ArtistLike } from './artist_like.entity';
import { User } from './user.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column()
  categoryId: number;

  @Index({fulltext: true})
  @Column()
  artistName: string;

  @Column()
  artistImg: string;

  @Column()
  debutSong: string;

  @Column()
  debutDate: string;

  @Column()
  artistInfo: string;

  @Column()
  createdAt: string;

  // @Column({ default: 0})
  // likeCount: number;

  @OneToMany(() => ArtistLike, (artistLike) => artistLike.artistId)
  artistLikes: ArtistLike[];
  
  // @ManyToOne(() => User, (user) => user.artist)
  // @JoinColumn([{ name: 'userId', referencedColumnName: 'userId'}])
  // user: User;
  
}
