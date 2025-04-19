import { Controller, Logger } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  private logger = new Logger('ReviewsController');
  constructor(private reviewsService: ReviewsService) {}
}
