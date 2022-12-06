import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { ArtistLike } from './artist_like.entity';
import { User } from './user.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn({ name: 'artistId' })
  artistId: number;

  @Column()
  category: string;

  @Index({ fulltext: true })
  @Column()
  artistName: string;

  @Column()
  artistImg: string;

  @Column()
  debutSong: string;

  @Column()
  debutDate: string;

  // @Column({ default: 0})
  // likeCount: number;

  // @OneToMany(() => ArtistLike, (artistLike) => artistLike.artist)
  // artistLikes: ArtistLike[];

  // @ManyToMany(() => User, (user) => user.likedArtists)
  // @JoinColumn({
  //   name: 'artistLike',
  //   joinColumn: { name: 'artist_id', referencedColumnName: 'id'}
  // })

  // @ManyToOne(() => User, (user) => user.artists)
  // @JoinColumn([{ name: 'user_id', referencedColumnName: 'id'}])
  // user: User;

  @OneToMany(() => ArtistLike, (artistLike) => artistLike.artist)
  artists: Artist[];
}
