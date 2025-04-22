import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { AddItemDto } from './dto/add-item.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
@UseGuards(AuthGuard())
export class ItemsController {
  private logger = new Logger('ItemsController');
  constructor(private itemsService: ItemsService) {}

  @Post('/add')
  addItem(
    @Body() addItemDto: AddItemDto,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`Adding an item... {name: ${addItemDto.name}}`);
    return this.itemsService.addItem(addItemDto, user);
  }
}
