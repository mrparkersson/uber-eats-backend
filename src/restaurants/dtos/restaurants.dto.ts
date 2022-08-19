import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import {
  PaginationInput,
  PaginationOutput,
} from './../../common/dtos/pagination.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
