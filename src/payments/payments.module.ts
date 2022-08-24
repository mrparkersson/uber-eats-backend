import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { PaymentService } from './payments.service';
import { PaymentResolver } from './payment.resolver';
import { Payment } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
  providers: [PaymentResolver, PaymentService],
})
export class PaymentsModule {}
