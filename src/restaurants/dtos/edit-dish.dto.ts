import { MutationOutput } from './../../common/dtos/output.dto';
import { Dish } from './../entities/dish.entity';
import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
  'name',
  'description',
  'options',
  'price',
]) {
  @Field(() => Number)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends MutationOutput {}
