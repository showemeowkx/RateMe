import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
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
import { StreamifyInterceptor } from 'src/common/interceptors/streamify.interceptor';
import { ItemsProxy } from './items.proxy';

const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsProxy) {}

  @Get()
  @UseInterceptors(StreamifyInterceptor)
  getItems(@Query() filterDto: GetItemsFilterDto): Promise<Item[]> {
    return this.itemsService.getItems(filterDto);
  }

  @Get('/:itemId')
  getItemById(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemsService.getItemById(itemId);
  }

  @Post()
  @UseGuards(AuthGuard())
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
  ): Promise<void> {
    return this.itemsService.addItem(addItemDto, user, file);
  }
}
