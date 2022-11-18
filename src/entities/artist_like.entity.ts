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

  @ManyToOne(type => User, user => user.artistlikes)
  user: User

  @ManyToOne((type) => User, users => users.artistlikes)
  users: User

}
