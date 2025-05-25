/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import * as fs from 'fs/promises';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';

@Injectable()
export class CategoriesService {
  private logger = new Logger('CategoriesService', { timestamp: true });
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    const { name, slug } = filterDto;
    const query = this.categoriesRepository.createQueryBuilder('category');

    if (name) {
      query.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (slug) {
      query.andWhere('category.slug = :slug', { slug });
    }

    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get categories {filters: ${JSON.stringify(filterDto)}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const { name, slug, color } = createCategoryDto;

    const imagePath = file?.path;

    if (!imagePath) {
      this.logger.error(
        `[FILE ERROR] Failed to create a category {slug: ${slug}}`,
      );
      throw new InternalServerErrorException();
    }

    const category = this.categoriesRepository.create({
      name,
      slug,
      color,
      imagePath,
    });

    try {
      await this.categoriesRepository.save(category);
    } catch (error) {
      await fs.unlink(imagePath);
      if (error.code === '23505') {
        this.logger.error(
          `[ALREADY EXISTS] Failed to create a category {slug: ${slug}}`,
          error.stack,
        );
        throw new ConflictException(
          'A category with this slug/name already exists',
        );
      }
      this.logger.error(
        `[INTERNAL] Failed to create a category {slug: ${slug}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
