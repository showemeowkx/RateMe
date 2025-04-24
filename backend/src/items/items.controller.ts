import {
  Body,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { AddItemDto } from './dto/add-item.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageOptions } from './storage-options';

@Controller('items')
@UseGuards(AuthGuard())
export class ItemsController {
  private logger = new Logger('ItemsController');
  constructor(private itemsService: ItemsService) {}

  @Post('/add')
  @UseInterceptors(FileInterceptor('file', storageOptions))
  addItem(
    @Body() addItemDto: AddItemDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    this.logger.verbose(`Adding an item... {name: ${addItemDto.name}}`);
    return this.itemsService.addItem(addItemDto, user, file);
  }
}
