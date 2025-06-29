import { Request, Response } from 'express';

export interface PaymentServiceInterface {
  createCheckout(
    userId: string,
    productName: string,
    currency: string,
    price: number,
    success_url: string,
    cancel_url: string,
  ): Promise<{ url: string }>;

  handleWebhooks(req: Request, res: Response);
}
