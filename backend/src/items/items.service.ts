/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { AddItemDto } from './dto/add-item.dto';
import { User } from 'src/auth/user.entity';
import * as fs from 'fs/promises';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { CategoriesProxy } from 'src/categories/categories.proxy';

@Injectable()
export class ItemsService {
  private logger = new Logger('ItemsService', { timestamp: true });
  constructor(
    @InjectRepository(Item) private itemsRepository: Repository<Item>,
    private categoriesService: CategoriesProxy,
  ) {}

  async getItems(filterDto: GetItemsFilterDto): Promise<Item[]> {
    const { category, name, minRating, maxRating } = filterDto;

    const query = this.itemsRepository.createQueryBuilder('item');

    if (category) {
      const categoryEntity = await this.categoriesService.getCategories({
        slug: category,
      });
      query.andWhere('item.category.id = :categoryId', {
        categoryId: categoryEntity[0].id,
      });
    }

    if (name) {
      query.andWhere('LOWER(item.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (minRating) {
      query.andWhere('item.rating >= :minRating', { minRating });
    }

    if (maxRating) {
      query.andWhere('item.rating <= :maxRating', { maxRating });
    }

    query.leftJoinAndSelect('item.category', 'category');
    query.select([
      'item.id',
      'item.imagePath',
      'item.name',
      'item.rating',
      'category',
    ]);

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get items {filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getItemById(itemId: string): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: { id: itemId },
      relations: ['reviews', 'reviews.author', 'category'],
    });

    if (!item) {
      this.logger.error(
        `[NOT FOUND] Failed to get an item {itemId: ${itemId}}`,
      );
      throw new NotFoundException(`Item with id ${itemId} was not found`);
    }

    return item;
  }

  async addItem(
    addItemDto: AddItemDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<void> {
    const { categorySlug, name, description } = addItemDto;

    const imagePath = file?.path;

    if (!imagePath) {
      this.logger.error(
        `[FILE ERROR] Failed to create a category {slug: ${categorySlug}}`,
      );
      throw new InternalServerErrorException();
    }

    const category = await this.categoriesService.getCategories({
      slug: categorySlug,
    });

    const item = this.itemsRepository.create({
      creator: user,
      imagePath,
      category: category[0],
      name,
      description,
      rating: 0,
      link: 'NO_LINK_PROVIDED',
    });

    try {
      await this.itemsRepository.save(item);
    } catch (error) {
      await fs.unlink(imagePath);
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
