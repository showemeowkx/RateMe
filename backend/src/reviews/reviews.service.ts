import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  private logger = new Logger('ReviewsService');
  constructor() {}
}
