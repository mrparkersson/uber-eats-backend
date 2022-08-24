import { User } from 'src/users/entities/user.entity';
import {
  CreatePaymentOutput,
  CreatePaymentInput,
} from './dtos/create-payment.dto';
import { PaymentService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver(Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => CreatePaymentOutput)
  @Role(['Owner'])
  async createPayment(
    @AuthUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }
}
