import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';

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

@Column()
latitude: number;

@Column()
longitude: number; 
  
  
 }
