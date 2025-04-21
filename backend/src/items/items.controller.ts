import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { AddItemDto } from './dto/add-item.dto';

@Controller('items')
export class ItemsController {
  private logger = new Logger('ItemsController');
  constructor(private itemsService: ItemsService) {}

  @Post('/add')
  addItem(@Body() addItemDto: AddItemDto): Promise<void> {
    this.logger.verbose(`Adding an item... {name: ${addItemDto.name}}`);
    return this.itemsService.addItem(addItemDto);
  }
}
