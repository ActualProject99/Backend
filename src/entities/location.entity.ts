import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  locationId: number;

  @Column()
  locationName: string;

  @Column()
  locationAddress: string;

  @Column()
  locationCall: string;

  @Column()
  locationUrl: string;

  @Column()
  locationImg: string;

  @Column('decimal', { precision: 5, scale: 10 })
  latitude: number;

  @Column('decimal', { precision: 5, scale: 10 })
  longitude: number;
}
