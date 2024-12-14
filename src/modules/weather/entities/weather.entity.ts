import {
  IsArray,
  IsDate,
  IsInt,
  IsObject,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'weather' })
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @IsInt()
  @Min(-90)
  @Max(90)
  lat: number;

  @Column({ type: 'int' })
  @IsInt()
  @Min(-180)
  @Max(180)
  lon: number;

  @Column({ type: 'varchar' })
  @IsString()
  part: string;

  @Column({ type: 'varchar' })
  @IsString()
  timezone: string;

  @Column({ type: 'int' })
  @IsInt()
  timezone_offset: number;

  @Column({ type: 'json' })
  @IsObject()
  current: Record<string, any>;

  @Column({ type: 'array' })
  @IsArray()
  minutely: { dt: number; precipitation: number }[];

  @Column({ type: 'array' })
  @IsArray()
  hourly: object[];

  @Column({ type: 'array' })
  @IsArray()
  daily: object[];

  @Column({ type: 'timestamp', default: new Date() })
  @IsDate()
  createdAt: Date;
}
