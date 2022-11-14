import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  userId: number;

  @Column({ unique: true })
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
