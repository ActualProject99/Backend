import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class hotConcert {
  @PrimaryGeneratedColumn()
  hotconcertId: number;

  @Column()
  concertId: number;

  @Column()
  posterName: string;

  @Column()
  posterImg: string;

  @Column()
  ticketingDate: string;

  @Column()
  locationName: string;

  @Column()
  exclusion: string;
}
