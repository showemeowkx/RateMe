import { Injectable, Logger } from '@nestjs/common';
import { ItemsService } from './items.service';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { Item } from './item.entity';
import { AddItemDto } from './dto/add-item.dto';
import { User } from 'src/auth/user.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { ItemsServiceInterface } from './items-service.interfase';
import * as NodeCache from 'node-cache';
import { SortItemsDto } from './dto/sort-items.dto';

@Injectable()
export class ItemsProxy implements ItemsServiceInterface {
  private logger = new Logger('ItemsProxy');
  private cache = new NodeCache({ stdTTL: 600 });

  constructor(private itemsService: ItemsService) {}

  async getItems(
    filterDto: GetItemsFilterDto,
    pagination: PaginationQueryDto,
    sortingDto: SortItemsDto,
  ): Promise<PaginationDto<Item>> {
    const cacheKey = JSON.stringify({ filterDto });
    const cachedItems = this.cache.get<PaginationDto<Item>>(cacheKey);
    if (cachedItems) {
      this.logger.verbose(
        `[CACHED] Getting items... {query: ${JSON.stringify(filterDto)}}`,
      );
      return cachedItems;
    }
    this.logger.verbose(
      `Getting items... {query: ${JSON.stringify(filterDto)}}`,
    );
    const items = await this.itemsService.getItems(
      filterDto,
      pagination,
      sortingDto,
    );
    this.cache.set(cacheKey, items);
    return items;
  }

  async getItemById(itemId: string): Promise<Item> {
    const cacheKey = `item-${itemId}`;
    const cachedItem = this.cache.get<Item>(cacheKey);
    if (cachedItem) {
      this.logger.verbose(`[CACHED] Getting item by id... {itemId: ${itemId}}`);
      return cachedItem;
    }
    this.logger.verbose(`Getting item by id... {itemId: ${itemId}}`);
    const item = await this.itemsService.getItemById(itemId);
    this.cache.set(cacheKey, item);
    return item;
  }

  async addItem(
    addItemDto: AddItemDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<{ itemId: string }> {
    this.cache.flushAll();
    this.logger.verbose(`Adding item... {name: ${addItemDto.name}}`);
    return this.itemsService.addItem(addItemDto, user, file);
  }

  async deleteItem(itemId: string): Promise<void> {
    this.cache.flushAll();
    this.logger.verbose(`Deleting an item... {itemId: ${itemId}}`);
    return this.itemsService.deleteItem(itemId);
  }
}
