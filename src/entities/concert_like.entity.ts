import {  Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Concert } from './concert.entity';
import { User } from './user.entity';


@Entity()
export class ConcertLike {
  @PrimaryGeneratedColumn()
  concertLikeId: number;

  @PrimaryColumn({ name: 'userId'})
  @ApiProperty()
  userId: number;

  @PrimaryColumn({ name: 'concertId'})
  @ApiProperty()
  concertId: number;




  @ManyToOne(() => User)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId'}])
  user: User;

  @ManyToOne(() => Concert)
  @JoinColumn([{ name: 'concertId', referencedColumnName: 'concertId'}])
  concert: Concert;
}
