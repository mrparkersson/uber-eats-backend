import { Order } from 'src/orders/entities/order.entity';
import { MutationOutput } from './../../common/dtos/output.dto';
import { OrderStatus } from './../entities/order.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class GetOrdersInput {
  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;
}

@ObjectType()
export class GetOrdersOutput extends MutationOutput {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
