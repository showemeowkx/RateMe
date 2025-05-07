import { Item } from 'src/items/item.entity';
import { Review } from 'src/reviews/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagePath: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @OneToMany(() => Item, (item) => item.creator, { eager: false })
  items: Item[];

  @OneToMany(() => Review, (review) => review.author, { eager: true })
  reviews: Review[];

  // @Column()
  // isModerator: boolean;
}
