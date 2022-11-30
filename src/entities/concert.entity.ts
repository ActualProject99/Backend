import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { ConcertLike } from './concert_like.entity';


@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  concertId: number;

  @Column()
  categoryId: number;

  @Column()
  artistId: number;

  @Column()
  month: number;

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
  calender: string;







  @OneToMany(() => ConcertLike, (concertLike) => concertLike.concert)
  concertLikes: ConcertLike[];


  @OneToMany(() => ConcertLike, (concertLike) => concertLike.concert)
  concerts: Concert[]
}
