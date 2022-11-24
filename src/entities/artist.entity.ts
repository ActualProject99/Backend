import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  artistId: number;

  @Column({nullable:true})
  concertId: number;

  @Column()
  artistName: string;

  @Column()
  artistImg: string;

  @Column()
  artistInfo: string;

  @Column({nullable:true})
  likeCount: number;
}
