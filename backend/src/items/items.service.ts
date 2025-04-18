import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  private logger = new Logger('ItemsService');
  constructor(
    @InjectRepository(Item) private itemsRepository: Repository<Item>,
  ) {}
}
