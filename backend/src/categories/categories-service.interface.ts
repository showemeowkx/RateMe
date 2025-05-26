import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';

export interface CategoriesServiceIInterface {
  getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]>;

  createCategory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ): Promise<void>;
}
