import { Controller, Logger } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  private logger = new Logger('ItemsController');
  constructor(private itemsService: ItemsService) {}
}
