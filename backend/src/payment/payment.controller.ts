import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('webhooks')
  handleWebhooks(@Req() req: Request, @Res() res: Response) {
    return this.paymentService.handleWebhooks(req, res);
  }

  @Post('buy/mod')
  @UseGuards(AuthGuard())
  buyModerator(@GetUser() user: User) {
    return this.paymentService.createCheckout(
      user.id,
      'Moderator Status',
      'uah',
      20000,
      //placeholder links
      `http://localhost:${process.env.FRONT_PORT}/payments/success`,
      `http://localhost:${process.env.FRONT_PORT}/payments/success`,
    );
  }
}
