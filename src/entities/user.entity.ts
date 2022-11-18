import { ApiProperty } from '@nestjs/swagger';
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
    example: '12345678',
    description: 'password',
    required: true,
  })
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
