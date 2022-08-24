import { MutationOutput } from './../../common/dtos/output.dto';
import { Payment } from './../entities/payment.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput extends PickType(Payment, ['transactionId']) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class CreatePaymentOutput extends MutationOutput {}
