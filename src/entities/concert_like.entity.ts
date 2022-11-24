import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class ConcertLike {
  @PrimaryGeneratedColumn()
  concertLikeId: number;

  @Column()
  userId: number;

  @Column()
  concertId: number;

  @Column()
  createdAt: string;
}
