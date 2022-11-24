import { Exclude } from 'class-transformer';
// import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { ArtistLike } from './artist_like.entity';

// @Index('email', ['email'], { unique: true })
@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  // @IsString()
  // @IsNotEmpty({ message: '이름을 작성해 주세요.' })
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  profileImg: string;

  @Column({ unique: false })
  nickname: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  like: number;

  @Column({ nullable: true })
  likeSinger: number;

  @Column({ nullable: true })
  likeConcert: number;
  
// 유저의 좋아요는 여러개, 사용자는 하나.
// 아티스트 Like 의 artistLike.user 필드에 User
// @JoinColumn({ referencedColumnName: "id" ,name:artistLikeId})가 디폴트임
  @OneToMany(() => ArtistLike, (artistLike) => artistLike.userId)
  artistLikes: ArtistLike[]
 
  @OneToMany(() => Artist, (artist) => artist.artistId)
  artist: Artist[];
}
