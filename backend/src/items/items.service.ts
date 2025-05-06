/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import * as fs from 'fs/promises';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';

@Injectable()
export class ItemsService {
  private logger = new Logger('ItemsService', { timestamp: true });
  constructor(
    @InjectRepository(Item) private itemsRepository: Repository<Item>,
  ) {}

  async getItems(filterDto: GetItemsFilterDto): Promise<Item[]> {
    const { category, name, minRating, maxRating } = filterDto;

    const query = this.itemsRepository.createQueryBuilder('item');

    if (category) {
      query.andWhere('item.category = :category', { category });
    }

    if (name) {
      query.andWhere('(LOWER(item.name) LIKE LOWER(:name)', {
        search: `%${name}%`,
      });
    }

    if (minRating) {
      query.andWhere('item.rating >= :minRating', { minRating });
    }

    if (maxRating) {
      query.andWhere('item.rating <= :maxRating', { maxRating });
    }

    query.select([
      'item.id',
      'item.imagePath',
      'item.category',
      'item.name',
      'item.rating',
    ]);

    try {
      const items = await query.getMany();
      return items;
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get tasks. {filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

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
    });

    try {
      await this.itemsRepository.save(item);
    } catch (error) {
      if (file?.path) await fs.unlink(file.path);
      if (error.code === '23505') {
        this.logger.error(
          `[ALREADY EXISTS] Failed to add an item {name: ${name}}`,
        );
        throw new ConflictException('An item with this name already exists');
      }
      this.logger.error(
        `[INTERNAL] Failed to add an item {name: ${name}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
