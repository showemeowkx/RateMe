import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Review } from 'src/reviews/review.entity';
import { Category } from 'src/categories/category.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.items)
  creator: User;

  @Column()
  imagePath: string;

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column('double precision')
  rating: number;

  @OneToMany(() => Review, (review) => review.item, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reviews: Review[];
}
