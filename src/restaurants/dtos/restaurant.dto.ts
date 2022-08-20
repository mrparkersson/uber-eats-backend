import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { MutationOutput } from './../../common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class RestaurantInput {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends MutationOutput {
  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
