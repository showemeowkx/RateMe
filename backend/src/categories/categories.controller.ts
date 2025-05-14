import { Controller, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  private logger = new Logger('CategoriesController');
  constructor(private categoriesService: CategoriesService) {}
}
