/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from '@nestjs/common';
import { PaymentServiceInterface } from './payment-service.interface';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { ProductInfoDto } from './dto/product-info.dto';
import Stripe from 'stripe';
import { fileLogger } from './transactions-logger';

const buildLogMessage = (session: Stripe.Checkout.Session): string => {
  const userId = session.metadata?.userId;
  const product = session.metadata?.product;
  const status = session.payment_status;
  const price = `${session.amount_total! / 100} ${session.currency!}`;

  return `${status.toUpperCase()} {userId: ${userId}} --- ${product} (${price})`;
};

export class PaymentProxy implements PaymentServiceInterface {
  private logger = new Logger('PaymentProxy');
  private fileLogger = fileLogger;

  constructor(private paymentService: PaymentService) {}

  async createCheckout(
    productInfoDto: ProductInfoDto,
  ): Promise<{ url: string }> {
    this.logger.verbose(
      `Creating a checkout session... {userId: ${productInfoDto.userId}, product: ${productInfoDto.productName}}`,
    );
    return await this.paymentService.createCheckout(productInfoDto);
  }

  async handleWebhooks(req: Request, res: Response): Promise<Response> {
    const result = await this.paymentService.handleWebhooks(req, res);

    try {
      const event = (req as { stripeEvent?: Stripe.Event }).stripeEvent;
      if (event && event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const message = buildLogMessage(session);
        this.fileLogger.info(message);
        this.logger.verbose(`Transaction completed: {${message}}`);
      }
    } catch (error) {
      this.logger.error('Failed to log purchase data', error.stack);
    }

    return result;
  }
}
