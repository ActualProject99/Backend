import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
// import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArtistLike } from './artist_like.entity';
import { ConcertLike } from './concert_like.entity';
import { Alarm } from './alarm.entity';

// @Index('email', ['email'], { unique: true })
@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ name: 'userId' })
  userId: number;

  // @IsString()
  // @IsNotEmpty({ message: '이름을 작성해 주세요.' })
  @ApiProperty({
    example: 'kmdet1235@naver.com',
    description: 'email',
    required: true,
  })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({
    example: 'profileImg.jpeg',
    description: 'profileImg',
    required: true,
  })
  @Column({
    nullable: true,
    default:
      'https://tgle.s3.ap-northeast-2.amazonaws.com/users/userDefault.png',
  })
  profileImg: string;

  @ApiProperty({
    example: '티글티글',
    description: 'nickname',
    required: true,
  })
  @Column({ unique: false })
  nickname: string;

  @ApiProperty({
    example: '01000001111',
    description: '핸드폰 번호',
    required: true,
  })
  @Column({ unique: false })
  phoneNumber: string;

  @ApiProperty({
    example: '12345678',
    description: 'password',
    required: true,
  })
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  currentHashedRefreshToken: string;

  @Column({ nullable: true })
  likeArtist: number;

  @Column({ nullable: true })
  likeConcert: number;

  // 유저의 좋아요는 여러개, 사용자는 하나.
  // 아티스트 Like 의 artistLike.user 필드에 User
  // @JoinColumn({ referencedColumnName: "id" ,name:artistLikeId})가 디폴트임
  @OneToMany(() => ArtistLike, (artistLike) => artistLike.user)
  artistLikes: ArtistLike[];

  @OneToMany(() => ConcertLike, (concertLike) => concertLike.user)
  concertLikes: ConcertLike[];

  @OneToMany(() => Alarm, (alarm) => alarm.user)
  alarms: Alarm[];

  // @OneToMany(() => Artist, (artist) => artist.user)
  // artists: Artist[];

  //  @ManyToMany(() => Artist, (artist) => artist.likingUsers)
  //  likedArtists: Artist[]
}
