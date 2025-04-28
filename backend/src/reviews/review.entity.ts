import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsePeriod } from './use-period.enum';
import { Item } from 'src/items/item.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  origin: string;

  @ManyToOne(() => Item, (item) => item.reviews, { eager: false })
  item: string;

  @ManyToOne(() => User, (user) => user.reviews, { eager: false })
  author: User;

  @Column()
  rating: number;

  @Column({ type: 'enum', enum: UsePeriod })
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
