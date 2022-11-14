import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  concertId: number;

  @Column()
  userId: number;

  @Column()
  nickname: string;

  @Column()
  profileImg: string;

  @Column()
  comment: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}