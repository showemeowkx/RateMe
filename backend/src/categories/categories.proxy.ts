import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesProxy {
  private logger = new Logger('CategoriesProxy');

  constructor(private categoriesService: CategoriesService) {}

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    this.logger.verbose(
      `Getting categories... {filters: ${JSON.stringify(filterDto)}}`,
    );
    return this.categoriesService.getCategories(filterDto);
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
