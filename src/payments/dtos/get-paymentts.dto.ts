import { Payment } from './../entities/payment.entity';
import { MutationOutput } from './../../common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPaymentsOutput extends MutationOutput {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}
