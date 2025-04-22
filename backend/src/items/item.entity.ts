import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categories } from './categories.enum';
import { User } from 'src/auth/user.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.items, { eager: true })
  creator: User;

  @Column()
  image: string;

  @Column()
  category: Categories;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @Column()
  link: string;

  //temporarily change
  @Column()
  reviews: string;
}
