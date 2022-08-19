import { MutationOutput } from './../../common/dtos/output.dto';
import { CreateRestaurantInput } from './create-restaurant.dto';

import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends MutationOutput {}
