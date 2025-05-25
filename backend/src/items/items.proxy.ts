import { Injectable, Logger } from '@nestjs/common';
import { ItemsService } from './items.service';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { Item } from './item.entity';
import { AddItemDto } from './dto/add-item.dto';
import { User } from 'src/auth/user.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class ItemsProxy {
  private logger = new Logger('ItemsProxy');

  constructor(private itemsService: ItemsService) {}

  async getItems(
    filterDto: GetItemsFilterDto,
    pagination: PaginationQueryDto,
  ): Promise<PaginationDto<Item>> {
    this.logger.verbose(
      `Getting items... {filters: ${JSON.stringify(filterDto)}}`,
    );
    return this.itemsService.getItems(filterDto, pagination);
  }

  async getItemById(itemId: string): Promise<Item> {
    this.logger.verbose(`Getting item by id... {itemId: ${itemId}}`);
    return this.itemsService.getItemById(itemId);
  }

  async addItem(
    addItemDto: AddItemDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<void> {
    this.logger.verbose(`Adding item... {name: ${addItemDto.name}}`);
    return this.itemsService.addItem(addItemDto, user, file);
  }
}
