import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { User } from './user.entity';

@Entity()
export class ArtistLike {
  @PrimaryGeneratedColumn()
  artistLikeId: number;

  @Column()
  createdAt: string;
  
 // 좋아요는 여러개? 사용자는 하나
 // 
  // @ManyToOne(type => User)
  // @JoinColumn({
  //   name: 'userId',
  //   referencedColumnName: 'userId'
  // })
  
  // @ManyToOne(type => Artist)
  // @JoinColumn({
  //   name: 'artistId',
  //   referencedColumnName: 'artistId'
  // })

  @ManyToOne(() => User, (user) => user.artistlikes)
  @JoinColumn({ name: 'artistlike_user_no'})
  user: User;

  @ManyToOne(() => Artist, (artist) => artist.artists)
  @JoinColumn({ name: 'artistlike_artist_no'})
  artist: Artist;



}
