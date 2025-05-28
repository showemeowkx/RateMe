import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesServiceIInterface } from './categories-service.interface';
import * as NodeCache from 'node-cache';

@Injectable()
export class CategoriesProxy implements CategoriesServiceIInterface {
  private logger = new Logger('CategoriesProxy');
  private cache = new NodeCache({ stdTTL: 600 });

  constructor(private categoriesService: CategoriesService) {}

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    const cacheKey = JSON.stringify(filterDto);
    const cachedCategories = this.cache.get<Category[]>(cacheKey);
    if (cachedCategories) {
      this.logger.verbose(
        `[CACHED] Getting categories... {filters: ${JSON.stringify(filterDto)}}`,
      );
      return cachedCategories;
    }
    this.logger.verbose(
      `Getting categories... {filters: ${JSON.stringify(filterDto)}}`,
    );
    const categories = await this.categoriesService.getCategories(filterDto);
    this.cache.set(cacheKey, categories);
    return categories;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ): Promise<void> {
    this.logger.verbose(
      `Creating a new category... {slug: ${createCategoryDto.slug}}`,
    );
    return this.categoriesService.createCategory(createCategoryDto, file);
  }
}
