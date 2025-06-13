/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Inject,
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
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { paginate } from 'src/common/pagination/pagination';
import { ItemsServiceInterface } from './items-service.interfase';
import { CategoriesServiceIInterface } from 'src/categories/categories-service.interface';
import { SortItemsDto } from './dto/sort-items.dto';
import { getPrimaryPath, getRealPath } from 'src/common/file-upload';

@Injectable()
export class ItemsService implements ItemsServiceInterface {
  private logger = new Logger('ItemsService', { timestamp: true });
  constructor(
    @InjectRepository(Item) private itemsRepository: Repository<Item>,
    @Inject('CATEGORIES_SERVICE')
    private categoriesService: CategoriesServiceIInterface,
  ) {}

  async getItems(
    filterDto: GetItemsFilterDto,
    pagination: PaginationQueryDto,
    sortingDto: SortItemsDto,
  ): Promise<PaginationDto<Item>> {
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

    query
      .leftJoinAndSelect('item.category', 'category')
      .select([
        'item.id',
        'item.imagePath',
        'item.name',
        'item.rating',
        'category',
      ]);

    if (sortingDto.sorting) {
      try {
        query.orderBy('item.rating', sortingDto.sorting);
      } catch (error) {
        this.logger.error(
          `[WRONG INPUT] Failed to sort items {sorting: ${sortingDto.sorting}}`,
          error.stack,
        );
        throw new ConflictException(
          `Unnable to apply '${sortingDto.sorting}' sorting method`,
        );
      }
    }

    try {
      return paginate(query, pagination.page, pagination.limit);
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
  ): Promise<{ itemId: string }> {
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

    if (category.length < 1) {
      await fs.unlink(imagePath);
      this.logger.error(`[WRONG INPUT] Failed to add an item {name: ${name}}`);
      throw new NotFoundException(
        `A category with slug '${categorySlug}' doesn't exist`,
      );
    }

    const item = this.itemsRepository.create({
      creator: user,
      imagePath: getPrimaryPath(imagePath),
      category: category[0],
      name,
      description,
      rating: 0,
    });

    try {
      await this.itemsRepository.save(item);
      return { itemId: item.id };
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

  async deleteItem(itemId: string): Promise<void> {
    const item = await this.getItemById(itemId);
    try {
      const imagePath = getRealPath(item.imagePath);
      await this.itemsRepository.remove(item).then(() => fs.unlink(imagePath));
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to delete an item {itemId: ${item.id}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
