import { MutationOutput } from './../../common/dtos/output.dto';
import { Order } from 'src/orders/entities/order.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class AcceptOrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class AcceptOrderOutput extends MutationOutput {}
