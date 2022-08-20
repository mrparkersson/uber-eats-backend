import {
  PaginationOutput,
  PaginationInput,
} from './../../common/dtos/pagination.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field(() => String)
  search: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
