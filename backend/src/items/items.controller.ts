import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { AddItemDto } from './dto/add-item.dto';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { setStorageOptions } from 'src/common/file-upload';
import { Item } from './item.entity';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { StreamifyInterceptor } from 'src/common/interceptors/streamify.interceptor';

const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

@Controller('items')
export class ItemsController {
  private logger = new Logger('ItemsController');
  constructor(private itemsService: ItemsService) {}

  @Get()
  @UseInterceptors(StreamifyInterceptor)
  getItems(@Query() filterDto: GetItemsFilterDto): Promise<Item[]> {
    this.logger.verbose(
      `Getting items... {filters: ${JSON.stringify(filterDto)}}`,
    );
    return this.itemsService.getItems(filterDto);
  }

  @Get('/:itemId')
  getItemById(@Param('itemId') itemId: string): Promise<Item> {
    this.logger.verbose(`Getting an item by id... {itemId: ${itemId}}`);
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
    this.logger.verbose(`Adding an item... {name: ${addItemDto.name}}`);
    return this.itemsService.addItem(addItemDto, user, file);
  }
}
