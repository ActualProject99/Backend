import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column()
  concertId: number;

  @Column()
  artistName: string;

  @Column()
  artistImg: string;

  @Column()
  artistInfo: string;

  @Column()
  likeCount: number;
}
