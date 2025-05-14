/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import * as fs from 'fs/promises';

@Injectable()
export class CategoriesService {
  private logger = new Logger('CategoriesService', { timestamp: true });
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getCategories(name: string): Promise<Category[]> {
    const query = this.categoriesRepository.createQueryBuilder('category');

    if (name) {
      query.andWhere('category.name LIKE :name', { name: `%${name}%` });
    }
    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get categories {filters: {name: ${name}}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ slug });

    if (!category) {
      this.logger.error(`[NOT FOUND] Failed to get a category {slug: ${slug}}`);
      throw new NotFoundException(`Category with slug ${slug} was not found`);
    }

    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const { name, slug, color } = createCategoryDto;
    const imagePath = file.path;

    const category = this.categoriesRepository.create({
      name,
      slug,
      color,
      imagePath,
    });

    try {
      await this.categoriesRepository.save(category);
    } catch (error) {
      if (file?.path) await fs.unlink(file.path);
      if (error.code === '23505') {
        this.logger.error(
          `[ALREADY EXISTS] Failed to create a category {slug: ${slug}}`,
          error.stack,
        );
        throw new ConflictException('A category with this slug already exists');
      }
      this.logger.error(
        `[INTERNAL] Failed to create a category {slug: ${slug}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
