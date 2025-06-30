import { Request, Response } from 'express';
import { ProductInfoDto } from './dto/product-info.dto';

export interface PaymentServiceInterface {
  createCheckout(productInfoDto: ProductInfoDto): Promise<{ url: string }>;

  handleWebhooks(req: Request, res: Response): Promise<Response>;
}
