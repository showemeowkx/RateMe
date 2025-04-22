import { Item } from 'src/items/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  isModerator: boolean;
}
