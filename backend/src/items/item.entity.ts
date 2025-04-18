import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Categories } from './categories.enum';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @Column()
  category: Categories;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @Column()
  link: string;

  @Column()
  reviews: string[];
}
