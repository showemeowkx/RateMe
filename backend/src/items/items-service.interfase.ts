import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { Item } from './item.entity';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { AddItemDto } from './dto/add-item.dto';
import { User } from 'src/auth/user.entity';
import { SortItemsDto } from './dto/sort-items.dto';

export interface ItemsServiceInterface {
  getItems(
    filterDto: GetItemsFilterDto,
    pagination: PaginationQueryDto,
    sortingDto: SortItemsDto,
  ): Promise<PaginationDto<Item>>;

  getItemById(id: string): Promise<Item>;

  addItem(
    addItemDto: AddItemDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<void>;
}
