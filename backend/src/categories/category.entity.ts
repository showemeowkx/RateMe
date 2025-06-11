import { Item } from 'src/items/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagePath: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  color: string;

  @OneToMany(() => Item, (item) => item.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: Item[];
}
