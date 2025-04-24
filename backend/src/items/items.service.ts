import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { AddItemDto } from './dto/add-item.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ItemsService {
  private logger = new Logger('ItemsService', { timestamp: true });
  constructor(
    @InjectRepository(Item) private itemsRepository: Repository<Item>,
  ) {}

  async addItem(
    addItemDto: AddItemDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<void> {
    const { category, name, description } = addItemDto;

    const item = this.itemsRepository.create({
      creator: user,
      imagePath: file.path,
      category,
      name,
      description,
      rating: 0,
      link: 'NO_LINK_PROVIDED',
      reviews: '',
    });

    try {
      await this.itemsRepository.save(item);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        this.logger.error(
          `[ALREADY EXISTS] Failed to add an item {name: ${name}}`,
        );
        throw new ConflictException('An item with this name already exists');
      }
      this.logger.error(
        `[INTERNAL] Failed to add an item {name: ${name}}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
