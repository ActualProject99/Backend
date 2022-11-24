import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArtistLike {
  @PrimaryGeneratedColumn()
  artistLikeId: number;

  @Column()
  userId: number;

  @Column()
  artistId: number;

  @Column()
  createdAt: string;
}
