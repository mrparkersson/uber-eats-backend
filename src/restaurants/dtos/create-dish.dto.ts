import { MutationOutput } from './../../common/dtos/output.dto';
import { Dish } from './../entities/dish.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'options',
  'description',
  'price',
]) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends MutationOutput {
  // @Field(() => Dish)
  // dish: Dish;
}
