import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentProxy } from './payment.proxy';

@Module({
  imports: [AuthModule],
  providers: [
    PaymentService,
    {
      provide: 'PAYMENT_SERVICE',
      useFactory: (paymentService: PaymentService) => {
        return new PaymentProxy(paymentService);
      },
      inject: [PaymentService],
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
