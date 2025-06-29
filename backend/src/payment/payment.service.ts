/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PaymentServiceInterface } from './payment-service.interface';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { AuthServiceInterface } from 'src/auth/auth-service.interface';
import { ProductInfoDto } from './dto/product-info.dto';

@Injectable()
export class PaymentService implements PaymentServiceInterface {
  @Inject('AUTH_SERVICE') private authService: AuthServiceInterface;
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  private logger = new Logger('PaymentService', { timestamp: true });

  async createCheckout(
    productInfoDto: ProductInfoDto,
  ): Promise<{ url: string }> {
    const { userId, productName, currency, price, success_url, cancel_url } =
      productInfoDto;
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: { name: productName },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url,
        cancel_url,
        metadata: {
          userId,
          product: productName,
        },
      });

      return { url: session.url! };
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to create a checkout {userId: ${userId}, product: ${productName}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async handleWebhooks(req: Request, res: Response): Promise<Response> {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = await this.stripe.webhooks.constructEventAsync(
        req.body as Buffer,
        sig!,
        process.env.STRIPE_WEBHOOK_KEY!,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      (req as any).stripeEvent = event;
    } catch (error) {
      this.logger.error('[INTERNAL] Failed to handle a webhook', error.stack);
      return res.status(500).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const product = session.metadata?.product;

      if (product === 'Moderator Status' && userId) {
        await this.authService.setModeratorStatus(userId);
      }
    }

    return res.status(200).send();
  }
}
