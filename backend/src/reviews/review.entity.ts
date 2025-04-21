import { User } from 'src/auth/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UsePeriod } from './use-period.enum';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  origin: string;

  @Column()
  itemId: string;

  @Column()
  author: User;

  @Column()
  rating: number;

  @Column()
  usePreiod: UsePeriod;

  @Column()
  isRecommended: boolean;

  @Column()
  liked: string;

  @Column()
  disliked: string;

  @Column()
  text: string;
}
