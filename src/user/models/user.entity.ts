import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('email', ['email'], { unique: true })
@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  userId: number;

  @IsString()
  @IsNotEmpty({ message: '이름을 작성해 주세요.' })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ nullable: true })
  profileImg: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, default: null })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  like: number;

  @Column({ nullable: true })
  likeSinger: number;

  @Column({ nullable: true })
  likeConcert: number;
}
