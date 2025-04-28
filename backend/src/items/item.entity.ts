import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './categories.enum';
import { User } from 'src/auth/user.entity';
import { Review } from 'src/reviews/review.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.items, { eager: true })
  creator: User;

  @Column()
  imagePath: string;

  @Column({ type: 'enum', enum: Categories })
  category: Categories;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column('double precision')
  rating: number;

  @Column()
  link: string;

  @OneToMany(() => Review, (review) => review.item, { eager: true })
  reviews: Review[];
}
