import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { setStorageOptions } from 'src/common/file-upload';
import { Item } from './item.entity';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { ItemsServiceInterface } from './items-service.interfase';
import { SortItemsDto } from './dto/sort-items.dto';
import { ValidationExceptionFilter } from 'src/common/validation-exception-filter';
import { ModeratorGuard } from 'src/common/decorators/guards/moderator.guard';

const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

@Controller('items')
export class ItemsController {
  constructor(
    @Inject('ITEMS_SERVICE') private itemsService: ItemsServiceInterface,
  ) {}

  @Get()
  getItems(
    @Query() filterDto: GetItemsFilterDto,
    @Query() pagination: PaginationQueryDto,
    @Query() sortingDto: SortItemsDto,
  ): Promise<PaginationDto<Item>> {
    return this.itemsService.getItems(filterDto, pagination, sortingDto);
  }

  @Get('/:itemId')
  getItemById(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemsService.getItemById(itemId);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseFilters(ValidationExceptionFilter)
  @UseInterceptors(
    FileInterceptor(
      'file',
      setStorageOptions('item-images', allowedExtensions),
    ),
  )
  addItem(
    @Body() addItemDto: AddItemDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ itemId: string }> {
    return this.itemsService.addItem(addItemDto, user, file);
  }

  @Delete('/:itemId')
  @UseGuards(ModeratorGuard)
  deleteItem(@Param('itemId') itemId: string): Promise<void> {
    return this.itemsService.deleteItem(itemId);
  }
}
