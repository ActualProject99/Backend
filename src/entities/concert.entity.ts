import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  concertId: number;

  @Column()
  categoryId: number;

  @Column()
  artistId: number;

  @Column()
  concertName: string;

  @Column()
  concertImg: string;

  @Column()
  likeCount: number;

  @Column()
  reviewCount: number;

  @Column()
  concertInfo: string;

  @Column()
  concertDate: string;

  @Column()
  ticketingDate: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @Column()
  calender: string;
}
