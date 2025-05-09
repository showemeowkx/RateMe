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

  @ManyToOne(() => Item, (item) => item.reviews)
  item: Item;

  @ManyToOne(() => User, (user) => user.reviews)
  author: User;

  @Column({ type: 'enum', enum: UsePeriod })
  usePeriod: UsePeriod;

  @Column()
  liked: string;

  @Column()
  disliked: string;

  @Column()
  text: string;
}
