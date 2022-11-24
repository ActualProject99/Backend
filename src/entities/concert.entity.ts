import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  concertId: number;

  @Column()
  categoryId: number;

  @Column()
  artistId: number;

  @Index({fulltext: true})
  @Column()
  concertName: string;

  @Column()
  concertImg: string;

  @Column()
  concertInfo: string;

  @Column()
  concertDate: string;

  @Column()
  ticketingDate: string;

  @Column()
  ticketingUrl: string;

  @Column()
  locationName: string;

  @Column()
  playTime: string;

  @Column()
  ratings: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @Column()
  calender: string;
}
