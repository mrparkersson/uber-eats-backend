import { MutationOutput } from './../../common/dtos/output.dto';
import { Order } from 'src/orders/entities/order.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class GetOrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class GetOrderOutput extends MutationOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}
