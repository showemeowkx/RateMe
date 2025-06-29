import { Controller, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaymentServiceInterface } from './payment-service.interface';

@Controller('payments')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE') private paymentService: PaymentServiceInterface,
  ) {}

  @Post('webhooks')
  handleWebhooks(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return this.paymentService.handleWebhooks(req, res);
  }

  @Post('buy/mod')
  @UseGuards(AuthGuard())
  buyModerator(@GetUser() user: User): Promise<{ url: string }> {
    return this.paymentService.createCheckout({
      userId: user.id,
      productName: 'Moderator Status',
      currency: 'uah',
      price: 20000,
      //placeholder links
      success_url: `http://localhost:${process.env.FRONT_PORT}/payments/success`,
      cancel_url: `http://localhost:${process.env.FRONT_PORT}/payments/success`,
    });
  }
}
