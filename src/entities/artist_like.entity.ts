import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

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

  @ManyToOne(() => User, user => user.likes)
  user: User;

}
