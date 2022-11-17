import { Exclude } from 'class-transformer';
// import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ unique: false })
  name: string;

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
}
